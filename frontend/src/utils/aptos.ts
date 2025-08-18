import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { AptosConfig as CustomAptosConfig, TransactionResponse, ViewFunction, ModuleFunction } from '../types/aptos';
import { ResearchRecord } from '../types';

export class AptosService {
  private aptos: Aptos;
  private config: CustomAptosConfig;

  constructor(config: CustomAptosConfig) {
    this.config = config;

    const aptosConfig = new AptosConfig({
      network: config.network as Network,
      nodeUrl: config.nodeUrl,
      faucetUrl: config.faucetUrl,
    });

    this.aptos = new Aptos(aptosConfig);
  }

  /**
   * Get account balance in APT
   */
  async getAccountBalance(address: string): Promise<number> {
    try {
      const resources = await this.aptos.getAccountResources({
        accountAddress: address
      });

      const coinResource = resources.find(
        (r: any) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );

      if (coinResource) {
        return parseInt(coinResource.data.coin.value) / 100000000; // Convert from Octas to APT
      }

      return 0;
    } catch (error) {
      console.error('Error getting account balance:', error);
      return 0;
    }
  }

  /**
   * Submit research data to the blockchain
   */
  async timestampResearch(
    account: Account,
    dataHash: string,
    description: string,
    moduleAddress: string
  ): Promise<TransactionResponse> {
    try {
      const transaction = await this.aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${moduleAddress}::ResearchTimestamp::timestamp_research`,
          typeArguments: [],
          functionArguments: [
            Array.from(Buffer.from(dataHash.replace('0x', ''), 'hex')),
            Array.from(Buffer.from(description, 'utf8'))
          ]
        }
      });

      const pendingTx = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction
      });

      const response = await this.aptos.waitForTransaction({
        transactionHash: pendingTx.hash
      });

      return {
        hash: response.hash,
        success: response.success,
        vmStatus: response.vm_status,
        gasUsed: response.gas_used,
        events: response.events
      };
    } catch (error) {
      console.error('Error submitting research:', error);
      throw new Error(`Failed to submit research: ${error}`);
    }
  }

  /**
   * Get research record for a specific researcher
   */
  async getResearchRecord(
    researcherAddress: string,
    moduleAddress: string
  ): Promise<ResearchRecord | null> {
    try {
      const response = await this.aptos.view({
        payload: {
          function: `${moduleAddress}::ResearchTimestamp::get_research_record`,
          typeArguments: [],
          functionArguments: [researcherAddress]
        }
      });

      if (response && response.length >= 5) {
        const [dataHash, submissionTime, address, description, isVerified] = response;

        return {
          id: researcherAddress,
          researcherAddress: address as string,
          dataHash: this.bytesToHex(dataHash as number[]),
          submissionTime: parseInt(submissionTime as string),
          description: description as string,
          isVerified: isVerified as boolean
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting research record:', error);
      return null;
    }
  }

  /**
   * Get total number of research submissions
   */
  async getTotalSubmissions(moduleAddress: string): Promise<number> {
    try {
      const response = await this.aptos.view({
        payload: {
          function: `${moduleAddress}::ResearchTimestamp::get_total_submissions`,
          typeArguments: [],
          functionArguments: []
        }
      });

      return response[0] ? parseInt(response[0] as string) : 0;
    } catch (error) {
      console.error('Error getting total submissions:', error);
      return 0;
    }
  }

  /**
   * Fund account with testnet tokens
   */
  async fundAccount(address: string): Promise<boolean> {
    try {
      if (this.config.network !== 'testnet') {
        throw new Error('Funding only available on testnet');
      }

      await this.aptos.fundAccount({
        accountAddress: address,
        amount: 100_000_000 // 1 APT in Octas
      });

      return true;
    } catch (error) {
      console.error('Error funding account:', error);
      return false;
    }
  }

  /**
   * Get account events
   */
  async getAccountEvents(
    address: string,
    eventType: string
  ): Promise<any[]> {
    try {
      const events = await this.aptos.getAccountEventsByEventType({
        accountAddress: address,
        eventType
      });

      return events;
    } catch (error) {
      console.error('Error getting account events:', error);
      return [];
    }
  }

  /**
   * Utility function to convert byte array to hex string
   */
  private bytesToHex(bytes: number[]): string {
    return '0x' + bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Utility function to convert hex string to byte array
   */
  private hexToBytes(hex: string): number[] {
    const cleanHex = hex.replace('0x', '');
    const bytes = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes.push(parseInt(cleanHex.substr(i, 2), 16));
    }
    return bytes;
  }

  /**
   * Check if an address is valid
   */
  static isValidAddress(address: string): boolean {
    try {
      // Basic validation - should be 66 characters long and start with 0x
      return /^0x[a-fA-F0-9]{64}$/.test(address);
    } catch {
      return false;
    }
  }

  /**
   * Format address for display (truncate middle)
   */
  static formatAddress(address: string, chars: number = 8): string {
    if (!address) return '';
    if (address.length <= chars * 2) return address;

    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }
}

export default AptosService;
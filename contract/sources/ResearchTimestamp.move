module MyModule::ResearchTimestamp {
    use aptos_framework::signer;
    use aptos_framework::timestamp;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::account;
    use aptos_framework::event;
    use std::string::{Self, String};
    use std::vector;

    #[event]
    struct ResearchDataSubmitted has drop, store {
        researcher_address: address,
        data_hash: vector<u8>,
        submission_time: u64,
        description: String,
    }

    /// Struct representing timestamped research data
    struct ResearchRecord has store, key {
        data_hash: vector<u8>,
        submission_time: u64,
        researcher_address: address,
        description: String,
        is_verified: bool,
    }

    /// Global registry for all research records
    struct ResearchRegistry has key {
        records: Table<address, ResearchRecord>,
        total_submissions: u64,
    }

    const E_RESEARCH_ALREADY_EXISTS: u64 = 1;
    const E_RESEARCH_NOT_FOUND: u64 = 2;
    const E_INVALID_DATA_HASH: u64 = 3;

    /// Initialize the research registry (called once)
    fun init_module(deployer: &signer) {
        let registry = ResearchRegistry {
            records: table::new(),
            total_submissions: 0,
        };
        move_to(deployer, registry);
    }

    /// Function to timestamp research data or lab notes
    public entry fun timestamp_research(
        researcher: &signer,
        data_hash: vector<u8>,
        description: vector<u8>
    ) acquires ResearchRegistry {
        let researcher_addr = signer::address_of(researcher);

        // Validate data hash is not empty
        assert!(vector::length(&data_hash) > 0, E_INVALID_DATA_HASH);

        // Check if researcher already has a record
        let registry_addr = @MyModule;
        let registry = borrow_global_mut<ResearchRegistry>(registry_addr);

        assert!(!table::contains(&registry.records, researcher_addr), E_RESEARCH_ALREADY_EXISTS);

        let description_string = string::utf8(description);
        let current_time = timestamp::now_seconds();

        let record = ResearchRecord {
            data_hash,
            submission_time: current_time,
            researcher_address: researcher_addr,
            description: description_string,
            is_verified: false,
        };

        table::add(&mut registry.records, researcher_addr, record);
        registry.total_submissions = registry.total_submissions + 1;

        // Emit event
        event::emit(ResearchDataSubmitted {
            researcher_address: researcher_addr,
            data_hash,
            submission_time: current_time,
            description: description_string,
        });
    }

    /// Function to verify precedence and get research details
    #[view]
    public fun get_research_record(researcher_address: address): (vector<u8>, u64, address, String, bool) acquires ResearchRegistry {
        let registry_addr = @MyModule;
        let registry = borrow_global<ResearchRegistry>(registry_addr);

        assert!(table::contains(&registry.records, researcher_address), E_RESEARCH_NOT_FOUND);

        let record = table::borrow(&registry.records, researcher_address);
        (
            record.data_hash,
            record.submission_time,
            record.researcher_address,
            record.description,
            record.is_verified
        )
    }

    /// Get total number of research submissions
    #[view]
    public fun get_total_submissions(): u64 acquires ResearchRegistry {
        let registry_addr = @MyModule;
        let registry = borrow_global<ResearchRegistry>(registry_addr);
        registry.total_submissions
    }
}
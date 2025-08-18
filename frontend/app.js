// Research Data Timestamp Registry - JavaScript Application

class ResearchTimestampApp {
    constructor() {
        this.sampleData = {
            sampleResearchRecords: [
                {
                    id: "1",
                    researcherAddress: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
                    dataHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                    submissionTime: 1692825600,
                    description: "Quantum Computing Algorithm Analysis - Q-Gate Optimization Study",
                    isVerified: true
                },
                {
                    id: "2", 
                    researcherAddress: "0x9876543210abcdef0123456789abcdef01234567",
                    dataHash: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
                    submissionTime: 1692739200,
                    description: "Climate Change Impact Assessment - Antarctic Ice Core Data",
                    isVerified: true
                },
                {
                    id: "3",
                    researcherAddress: "0xfedcba9876543210fedcba9876543210fedcba98",
                    dataHash: "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
                    submissionTime: 1692652800,
                    description: "Medical Research Protocol - Drug Efficacy Trial Phase II",
                    isVerified: false
                },
                {
                    id: "4",
                    researcherAddress: "0x456789abcdef0123456789abcdef0123456789ab",
                    dataHash: "0x456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
                    submissionTime: 1692566400,
                    description: "Machine Learning Model - Neural Network Architecture Study",
                    isVerified: true
                },
                {
                    id: "5",
                    researcherAddress: "0xabcdef123456789abcdef123456789abcdef1234",
                    dataHash: "0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef",
                    submissionTime: 1692480000,
                    description: "Astrophysics Research - Exoplanet Detection Analysis",
                    isVerified: true
                }
            ],
            statistics: {
                totalSubmissions: 5,
                verifiedSubmissions: 4,
                activeResearchers: 5,
                averageVerificationTime: "2.3 hours"
            },
            userProfile: {
                connectedAddress: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
                hasSubmission: true,
                submissionId: "1"
            }
        };

        this.isWalletConnected = false;
        this.connectedAddress = null;
        this.currentView = 'dashboard';
        this.uploadedFiles = [];
        this.chart = null;

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApp();
            });
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        // Ensure loading overlay is hidden first
        this.hideLoading();
        
        this.setupEventListeners();
        this.showView('dashboard');
        this.populateStatistics();
        this.populateRecentSubmissions();
        
        // Initialize chart after a brief delay to ensure canvas is properly rendered
        setTimeout(() => {
            this.initChart();
        }, 100);
        
        this.updateProfileView();
    }

    setupEventListeners() {
        // Navigation - Fixed with more robust event handling
        const navLinks = document.querySelectorAll('.nav-link[data-view]');
        console.log('Found navigation links:', navLinks.length);
        
        navLinks.forEach((link, index) => {
            console.log(`Setting up listener for link ${index}:`, link.getAttribute('data-view'));
            
            // Remove any existing listeners and add new one
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const view = newLink.getAttribute('data-view');
                console.log('Navigation clicked:', view);
                this.showView(view);
            });
        });

        // Wallet connection
        const connectBtn = document.getElementById('connectWallet');
        const disconnectBtn = document.getElementById('disconnectWallet');
        
        if (connectBtn) {
            connectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.connectWallet();
            });
        }

        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.disconnectWallet();
            });
        }

        // File upload
        const fileInput = document.getElementById('fileInput');
        const fileUploadArea = document.getElementById('fileUploadArea');

        if (fileUploadArea && fileInput) {
            fileUploadArea.addEventListener('click', () => fileInput.click());
            fileUploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            fileUploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            fileUploadArea.addEventListener('drop', this.handleDrop.bind(this));
            fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        // Form submissions
        const submitForm = document.getElementById('submitForm');
        const searchBtn = document.getElementById('searchBtn');
        
        if (submitForm) {
            submitForm.addEventListener('submit', this.handleResearchSubmit.bind(this));
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        // Form preview updates - Fixed to work with both fields
        const descriptionField = document.getElementById('researchDescription');
        const hashField = document.getElementById('dataHash');
        
        if (descriptionField) {
            descriptionField.addEventListener('input', () => {
                console.log('Description field changed');
                this.updatePreview();
            });
            descriptionField.addEventListener('keyup', () => {
                this.updatePreview();
            });
        }
        
        if (hashField) {
            hashField.addEventListener('input', () => {
                console.log('Hash field changed');
                this.updatePreview();
            });
            hashField.addEventListener('keyup', () => {
                this.updatePreview();
            });
        }

        // Search on Enter
        const searchAddress = document.getElementById('searchAddress');
        if (searchAddress) {
            searchAddress.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch();
                }
            });
        }
    }

    showView(viewName) {
        console.log('Switching to view:', viewName);
        
        // Validate viewName
        const validViews = ['dashboard', 'submit', 'verify', 'profile'];
        if (!validViews.includes(viewName)) {
            console.error('Invalid view name:', viewName);
            return;
        }
        
        // Update navigation - remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current nav link
        const currentNavLink = document.querySelector(`[data-view="${viewName}"]`);
        if (currentNavLink) {
            currentNavLink.classList.add('active');
        } else {
            console.warn('Nav link not found for view:', viewName);
        }

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
            console.log('Successfully activated view:', viewName);
        } else {
            console.error('View element not found:', `${viewName}View`);
            return;
        }

        this.currentView = viewName;

        // Update view-specific content
        if (viewName === 'profile') {
            this.updateProfileView();
        } else if (viewName === 'submit') {
            // Initialize preview for submit view
            setTimeout(() => {
                this.updatePreview();
            }, 50);
        }
    }

    async connectWallet() {
        try {
            this.showLoading();
            
            // Simulate wallet connection delay
            await this.delay(1500);
            
            // Mock wallet connection
            this.isWalletConnected = true;
            this.connectedAddress = this.sampleData.userProfile.connectedAddress;
            
            // Update UI
            const connectBtn = document.getElementById('connectWallet');
            const walletInfo = document.getElementById('walletInfo');
            const walletAddress = document.getElementById('walletAddress');
            
            if (connectBtn) connectBtn.style.display = 'none';
            if (walletInfo) walletInfo.classList.remove('hidden');
            if (walletAddress) walletAddress.textContent = this.truncateAddress(this.connectedAddress);
            
            // Update statistics
            const userSubmissions = document.getElementById('userSubmissions');
            if (userSubmissions) userSubmissions.textContent = '1';
            
            this.hideLoading();
            this.showToast('Wallet connected successfully!', 'success');
            this.updateProfileView();
            
            // Update submit form preview if we're on that view
            if (this.currentView === 'submit') {
                this.updatePreview();
            }
            
        } catch (error) {
            this.hideLoading();
            this.showToast('Failed to connect wallet', 'error');
        }
    }

    disconnectWallet() {
        this.isWalletConnected = false;
        this.connectedAddress = null;
        
        const connectBtn = document.getElementById('connectWallet');
        const walletInfo = document.getElementById('walletInfo');
        const userSubmissions = document.getElementById('userSubmissions');
        
        if (connectBtn) connectBtn.style.display = 'block';
        if (walletInfo) walletInfo.classList.add('hidden');
        if (userSubmissions) userSubmissions.textContent = '-';
        
        this.showToast('Wallet disconnected', 'info');
        this.updateProfileView();
        
        // Update submit form preview if we're on that view
        if (this.currentView === 'submit') {
            this.updatePreview();
        }
    }

    populateStatistics() {
        const stats = this.sampleData.statistics;
        
        const totalSubmissions = document.getElementById('totalSubmissions');
        const verifiedSubmissions = document.getElementById('verifiedSubmissions');
        const avgVerificationTime = document.getElementById('avgVerificationTime');
        
        if (totalSubmissions) totalSubmissions.textContent = stats.totalSubmissions;
        if (verifiedSubmissions) verifiedSubmissions.textContent = stats.verifiedSubmissions;
        if (avgVerificationTime) avgVerificationTime.textContent = stats.averageVerificationTime;
    }

    populateRecentSubmissions() {
        const tbody = document.getElementById('submissionsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.sampleData.sampleResearchRecords
            .sort((a, b) => b.submissionTime - a.submissionTime)
            .forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <span class="address-display">${this.truncateAddress(record.researcherAddress)}</span>
                    </td>
                    <td>${this.formatDate(record.submissionTime)}</td>
                    <td>
                        <span class="description-truncate" title="${record.description}">
                            ${record.description}
                        </span>
                    </td>
                    <td>
                        <span class="hash-display">${record.dataHash.substring(0, 10)}...</span>
                    </td>
                    <td>
                        <span class="status-badge ${record.isVerified ? 'verified' : 'pending'}">
                            <i class="fas fa-${record.isVerified ? 'check-circle' : 'clock'}"></i>
                            ${record.isVerified ? 'Verified' : 'Pending'}
                        </span>
                    </td>
                `;
                tbody.appendChild(row);
            });
    }

    initChart() {
        const canvas = document.getElementById('submissionsChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Generate chart data from submission times
        const chartData = this.generateChartData();
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Research Submissions',
                    data: chartData.data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    generateChartData() {
        const submissions = this.sampleData.sampleResearchRecords;
        const days = 7;
        const labels = [];
        const data = [];
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Simulate data distribution
            const count = i < 3 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2);
            data.push(count);
        }
        
        return { labels, data };
    }

    // File handling
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    async processFiles(files) {
        this.uploadedFiles = [];
        const fileList = document.getElementById('fileList');
        if (fileList) fileList.innerHTML = '';

        for (const file of files) {
            const hash = await this.generateFileHash(file);
            const fileData = {
                name: file.name,
                size: this.formatFileSize(file.size),
                hash: hash
            };
            
            this.uploadedFiles.push(fileData);
            
            if (fileList) {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-item-info">
                        <i class="fas fa-file"></i>
                        <div>
                            <div class="file-item-name">${fileData.name}</div>
                            <div class="file-item-size">${fileData.size}</div>
                            <div class="file-item-hash">Hash: ${fileData.hash}</div>
                        </div>
                    </div>
                    <button type="button" class="btn btn--sm btn--outline copy-button" onclick="app.copyToClipboard('${fileData.hash}')">
                        <i class="fas fa-copy"></i>
                    </button>
                `;
                fileList.appendChild(fileItem);
            }
        }

        // Update data hash field with combined hash
        if (this.uploadedFiles.length > 0) {
            const combinedHash = await this.generateCombinedHash();
            const dataHashField = document.getElementById('dataHash');
            if (dataHashField) dataHashField.value = combinedHash;
        }

        this.updatePreview();
    }

    async generateFileHash(file) {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async generateCombinedHash() {
        if (this.uploadedFiles.length === 0) return '';
        
        const combined = this.uploadedFiles.map(f => f.hash).join('');
        const encoder = new TextEncoder();
        const data = encoder.encode(combined);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    updatePreview() {
        const descriptionField = document.getElementById('researchDescription');
        const dataHashField = document.getElementById('dataHash');
        const previewContent = document.getElementById('previewContent');
        
        if (!previewContent) return;
        
        const description = descriptionField ? descriptionField.value.trim() : '';
        const dataHash = dataHashField ? dataHashField.value.trim() : '';

        console.log('Updating preview - Description:', !!description, 'Hash:', !!dataHash, 'Files:', this.uploadedFiles.length);

        if (!description && !dataHash && this.uploadedFiles.length === 0) {
            previewContent.innerHTML = '<p class="preview-empty">Fill in the form to see preview</p>';
            return;
        }

        let previewHTML = '';
        
        if (description) {
            previewHTML += `
                <div class="preview-item">
                    <div class="preview-label">Description:</div>
                    <div class="preview-value">${description}</div>
                </div>
            `;
        }

        if (this.uploadedFiles.length > 0) {
            previewHTML += `
                <div class="preview-item">
                    <div class="preview-label">Files (${this.uploadedFiles.length}):</div>
                    <div class="preview-value">${this.uploadedFiles.map(f => f.name).join(', ')}</div>
                </div>
            `;
        }

        if (dataHash) {
            previewHTML += `
                <div class="preview-item">
                    <div class="preview-label">Data Hash:</div>
                    <div class="preview-value" style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">${dataHash}</div>
                </div>
            `;
        }

        if (this.isWalletConnected) {
            previewHTML += `
                <div class="preview-item">
                    <div class="preview-label">Researcher:</div>
                    <div class="preview-value" style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">${this.connectedAddress}</div>
                </div>
            `;
        }

        previewContent.innerHTML = previewHTML;
    }

    async handleResearchSubmit(e) {
        e.preventDefault();
        
        if (!this.isWalletConnected) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }

        const descriptionField = document.getElementById('researchDescription');
        const dataHashField = document.getElementById('dataHash');
        
        const description = descriptionField ? descriptionField.value.trim() : '';
        const dataHash = dataHashField ? dataHashField.value.trim() : '';

        if (!description || !dataHash) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            this.showLoading();
            
            // Simulate blockchain transaction
            await this.delay(3000);
            
            // Create new submission
            const newSubmission = {
                id: (this.sampleData.sampleResearchRecords.length + 1).toString(),
                researcherAddress: this.connectedAddress,
                dataHash: dataHash,
                submissionTime: Math.floor(Date.now() / 1000),
                description: description,
                isVerified: false
            };
            
            // Add to data
            this.sampleData.sampleResearchRecords.unshift(newSubmission);
            this.sampleData.statistics.totalSubmissions++;
            
            // Update UI
            this.populateRecentSubmissions();
            this.populateStatistics();
            
            // Reset form
            const submitForm = document.getElementById('submitForm');
            const fileList = document.getElementById('fileList');
            
            if (submitForm) submitForm.reset();
            if (fileList) fileList.innerHTML = '';
            
            this.uploadedFiles = [];
            this.updatePreview();
            
            this.hideLoading();
            this.showToast('Research submitted successfully! Verification pending.', 'success');
            
            // Navigate to dashboard to see the new submission
            setTimeout(() => {
                this.showView('dashboard');
            }, 1000);
            
        } catch (error) {
            this.hideLoading();
            this.showToast('Failed to submit research', 'error');
        }
    }

    handleSearch() {
        const searchField = document.getElementById('searchAddress');
        const resultsContainer = document.getElementById('searchResults');
        
        if (!searchField || !resultsContainer) return;
        
        const searchTerm = searchField.value.trim();
        
        if (!searchTerm) {
            this.showToast('Please enter a search term', 'error');
            return;
        }

        // Search by address or hash
        const results = this.sampleData.sampleResearchRecords.filter(record => 
            record.researcherAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.dataHash.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="card">
                    <div class="card__body">
                        <div class="no-results">
                            <i class="fas fa-search"></i>
                            <h3>No Results Found</h3>
                            <p>No research records found for "${searchTerm}"</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        let resultsHTML = '';
        results.forEach(record => {
            resultsHTML += `
                <div class="result-card">
                    <div class="result-header">
                        <h3 class="result-title">Research Record</h3>
                        <span class="status-badge ${record.isVerified ? 'verified' : 'pending'}">
                            <i class="fas fa-${record.isVerified ? 'check-circle' : 'clock'}"></i>
                            ${record.isVerified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                    <div class="result-body">
                        <div class="result-field">
                            <div class="result-field-label">Researcher Address</div>
                            <div class="result-field-value" style="font-family: var(--font-family-mono); word-break: break-all;">
                                ${record.researcherAddress}
                                <button class="btn btn--sm btn--outline copy-button" onclick="app.copyToClipboard('${record.researcherAddress}')">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        <div class="result-field">
                            <div class="result-field-label">Data Hash</div>
                            <div class="result-field-value" style="font-family: var(--font-family-mono); word-break: break-all;">
                                ${record.dataHash}
                                <button class="btn btn--sm btn--outline copy-button" onclick="app.copyToClipboard('${record.dataHash}')">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        <div class="result-field">
                            <div class="result-field-label">Submission Time</div>
                            <div class="result-field-value">${this.formatDate(record.submissionTime)}</div>
                        </div>
                        <div class="result-field">
                            <div class="result-field-label">Description</div>
                            <div class="result-field-value">${record.description}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        resultsContainer.innerHTML = resultsHTML;
    }

    updateProfileView() {
        const profileContent = document.getElementById('profileContent');
        if (!profileContent) return;
        
        if (!this.isWalletConnected) {
            profileContent.innerHTML = `
                <div class="wallet-required">
                    <div class="card">
                        <div class="card__body">
                            <div class="empty-state">
                                <i class="fas fa-wallet"></i>
                                <h3>Connect Wallet Required</h3>
                                <p>Please connect your wallet to view your research records.</p>
                                <button class="btn btn--primary" onclick="document.getElementById('connectWallet').click()">
                                    Connect Wallet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Find user's submissions
        const userRecords = this.sampleData.sampleResearchRecords.filter(
            record => record.researcherAddress === this.connectedAddress
        );

        if (userRecords.length === 0) {
            profileContent.innerHTML = `
                <div class="card">
                    <div class="card__body">
                        <div class="empty-state">
                            <i class="fas fa-file-alt"></i>
                            <h3>No Research Records</h3>
                            <p>You haven't submitted any research records yet.</p>
                            <button class="btn btn--primary" onclick="app.showView('submit')">
                                Submit Research
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        let recordsHTML = '';
        userRecords.forEach(record => {
            recordsHTML += `
                <div class="result-card">
                    <div class="result-header">
                        <h3 class="result-title">Your Research Record</h3>
                        <span class="status-badge ${record.isVerified ? 'verified' : 'pending'}">
                            <i class="fas fa-${record.isVerified ? 'check-circle' : 'clock'}"></i>
                            ${record.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                    </div>
                    <div class="result-body">
                        <div class="result-field">
                            <div class="result-field-label">Data Hash</div>
                            <div class="result-field-value" style="font-family: var(--font-family-mono); word-break: break-all;">
                                ${record.dataHash}
                                <button class="btn btn--sm btn--outline copy-button" onclick="app.copyToClipboard('${record.dataHash}')">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        <div class="result-field">
                            <div class="result-field-label">Submission Time</div>
                            <div class="result-field-value">${this.formatDate(record.submissionTime)}</div>
                        </div>
                        <div class="result-field">
                            <div class="result-field-label">Description</div>
                            <div class="result-field-value">${record.description}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        profileContent.innerHTML = recordsHTML;
    }

    // Utility functions
    truncateAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    formatDate(timestamp) {
        return new Date(timestamp * 1000).toLocaleString();
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!', 'success');
        } catch (error) {
            this.showToast('Failed to copy to clipboard', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-triangle' : 'info-circle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when the script loads
const app = new ResearchTimestampApp();
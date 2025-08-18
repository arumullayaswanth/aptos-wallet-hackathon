import React, { useEffect, useState } from 'react';
import { ResearchRecord, Statistics, ChartData } from '../types';
import FormattingUtils from '../utils/formatting';

interface DashboardProps {
  statistics: Statistics;
  recentRecords: ResearchRecord[];
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  statistics,
  recentRecords,
  onRefresh,
  isLoading
}) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    // Prepare chart data from recent records
    const submissionsByDay = recentRecords.reduce((acc, record) => {
      const date = new Date(record.submissionTime * 1000).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    const data = last7Days.map(date => submissionsByDay[date] || 0);

    setChartData({
      labels: last7Days,
      datasets: [{
        label: 'Research Submissions',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }]
    });
  }, [recentRecords]);

  const statCards = [
    {
      title: 'Total Submissions',
      value: FormattingUtils.formatNumber(statistics.totalSubmissions),
      icon: '📊',
      color: '#3b82f6',
      change: '+12%'
    },
    {
      title: 'Verified Records',
      value: FormattingUtils.formatNumber(statistics.verifiedSubmissions),
      icon: '✅',
      color: '#10b981',
      change: '+8%'
    },
    {
      title: 'Active Researchers',
      value: FormattingUtils.formatNumber(statistics.activeResearchers),
      icon: '👥',
      color: '#8b5cf6',
      change: '+5%'
    },
    {
      title: 'Avg. Verification Time',
      value: statistics.averageVerificationTime,
      icon: '⏱️',
      color: '#f59e0b',
      change: '-15%'
    }
  ];

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Research Data Timestamp Registry</h1>
          <p>
            Secure, immutable timestamping for academic research data. 
            Establish precedence and protect your intellectual property with blockchain technology.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large">
              <span>📤</span>
              Submit Research
            </button>
            <button className="btn btn-outline btn-large">
              <span>🔍</span>
              Verify Records
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="blockchain-visualization">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="block" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="block-content">
                  <div className="block-icon">🛡️</div>
                  <div className="block-text">Block {i + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-section">
        <div className="section-header">
          <h2>Research Statistics</h2>
          <button 
            className="btn btn-outline btn-sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Refreshing...
              </>
            ) : (
              <>
                <span>🔄</span>
                Refresh
              </>
            )}
          </button>
        </div>

        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-change positive">
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      {chartData && (
        <div className="chart-section">
          <div className="section-header">
            <h2>Submission Trends</h2>
          </div>
          <div className="chart-container">
            <canvas 
              id="submissionsChart" 
              width="800" 
              height="400"
              style={{ maxWidth: '100%', height: 'auto' }}
            ></canvas>
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Research Submissions</h2>
          <span className="section-subtitle">
            Latest {recentRecords.length} submissions from the community
          </span>
        </div>

        <div className="submissions-table">
          <div className="table-header">
            <div className="col-researcher">Researcher</div>
            <div className="col-description">Description</div>
            <div className="col-hash">Data Hash</div>
            <div className="col-time">Timestamp</div>
            <div className="col-status">Status</div>
          </div>

          <div className="table-body">
            {recentRecords.length > 0 ? (
              recentRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="table-row">
                  <div className="col-researcher">
                    <div className="researcher-info">
                      <div className="researcher-avatar" style={{
                        backgroundColor: FormattingUtils.stringToColor(record.researcherAddress)
                      }}>
                        {record.researcherAddress.slice(2, 4).toUpperCase()}
                      </div>
                      <div className="researcher-address">
                        {FormattingUtils.formatAddress(record.researcherAddress)}
                      </div>
                    </div>
                  </div>
                  <div className="col-description">
                    <div className="description-text" title={record.description}>
                      {FormattingUtils.truncateText(record.description, 60)}
                    </div>
                  </div>
                  <div className="col-hash">
                    <code className="hash-text">
                      {FormattingUtils.formatTxHash(record.dataHash, 8)}
                    </code>
                  </div>
                  <div className="col-time">
                    <div className="timestamp">
                      {FormattingUtils.formatRelativeTime(record.submissionTime)}
                    </div>
                    <div className="full-date">
                      {FormattingUtils.formatTimestamp(record.submissionTime, false)}
                    </div>
                  </div>
                  <div className="col-status">
                    <span className={`status-badge ${record.isVerified ? 'verified' : 'pending'}`}>
                      {record.isVerified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="table-empty">
                <div className="empty-icon">📭</div>
                <div className="empty-text">No research submissions yet</div>
                <div className="empty-subtitle">
                  Be the first to submit your research data for timestamping
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 2rem 0;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 4rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 1rem;
        }

        .hero-content h1 {
          font-size: 3rem;
          font-weight: 800;
          color: #1e40af;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .hero-content p {
          font-size: 1.125rem;
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
        }

        .btn-outline:hover {
          background: #3b82f6;
          color: white;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .blockchain-visualization {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .block {
          background: white;
          border-radius: 0.5rem;
          padding: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .block-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .block-icon {
          font-size: 1.5rem;
        }

        .block-text {
          font-weight: 600;
          color: #374151;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
        }

        .section-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stats-section {
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          line-height: 1;
        }

        .stat-title {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .chart-section {
          margin-bottom: 3rem;
        }

        .chart-container {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .recent-section {
          margin-bottom: 2rem;
        }

        .submissions-table {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 200px 1fr 150px 150px 120px;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-row {
          display: grid;
          grid-template-columns: 200px 1fr 150px 150px 120px;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f3f4f6;
          align-items: center;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .researcher-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .researcher-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .researcher-address {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
        }

        .description-text {
          color: #374151;
          line-height: 1.4;
        }

        .hash-text {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.75rem;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .timestamp {
          font-weight: 500;
          color: #374151;
        }

        .full-date {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.125rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.verified {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .table-empty {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .empty-subtitle {
          color: #6b7280;
        }

        .loading-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .table-header, .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .table-header {
            display: none;
          }

          .table-row {
            display: block;
            padding: 1.5rem;
          }

          .table-row > div {
            margin-bottom: 0.75rem;
          }

          .table-row > div:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
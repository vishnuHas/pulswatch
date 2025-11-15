# Dashboard Card Components

This directory contains all the modular card components used in the PulseWatch dashboard.

## Components

### Left Column Cards

1. **DateCard** (`DateCard.js`)
   - Displays current date (day number, day name, month)
   - Props: `dayNum`, `dayName`, `monthName`

2. **RefreshCard** (`RefreshCard.js`)
   - Button to refresh dashboard data
   - Props: `onRefresh` (callback function)

3. **MetricCard** (`MetricCard.js`)
   - Displays key metrics with icons
   - Props: `title`, `value`, `subtitle`, `icon`, `trend`
   - Used 4 times for: Total Mentions, Positive Sentiment, Live Alerts, Clusters

4. **TimelineCard** (`TimelineCard.js`)
   - Shows mentions over time chart
   - Props: `timelineData`

5. **TopicClustersCard** (`TopicClustersCard.js`)
   - Displays AI-detected topic clusters
   - Props: `clusterData`

6. **AIInsightsCard** (`AIInsightsCard.js`)
   - Shows AI-generated insights
   - Props: `insightsData`

7. **LiveMentionsFeedCard** (`LiveMentionsFeedCard.js`)
   - Real-time feed of mentions
   - Props: `mentions`

### Right Column Cards

8. **HelpCard** (`HelpCard.js`)
   - Help/support card with greeting
   - Props: None

9. **SentimentCard** (`SentimentCard.js`)
   - Sentiment analysis pie chart
   - Props: `sentimentData`

10. **LiveAlertsCard** (`LiveAlertsCard.js`)
    - Shows spike alerts
    - Props: `spikeData`

11. **RealTimeActivityCard** (`RealTimeActivityCard.js`)
    - Circular progress showing real-time activity
    - Props: `mentions`

12. **PlatformDistributionCard** (`PlatformDistributionCard.js`)
    - Platform split visualization
    - Props: `mentions`

13. **QuickStatsCard** (`QuickStatsCard.js`)
    - Dashboard summary with key stats
    - Props: `mentions`, `sentimentData`, `clusterData`

## Usage

Import all cards from the index file:

```javascript
import {
  DateCard,
  RefreshCard,
  MetricCard,
  TimelineCard,
  TopicClustersCard,
  AIInsightsCard,
  LiveMentionsFeedCard,
  HelpCard,
  SentimentCard,
  LiveAlertsCard,
  RealTimeActivityCard,
  PlatformDistributionCard,
  QuickStatsCard
} from '../../components/cards';
```

## Benefits

- **Modularity**: Each card is a separate, reusable component
- **Maintainability**: Easy to update individual cards without affecting others
- **Testability**: Each component can be tested independently
- **Reusability**: Cards can be used in different layouts or pages
- **Clean Code**: Main dashboard file is much cleaner and easier to read

## File Structure

```
components/
└── cards/
    ├── index.js                      # Export all cards
    ├── DateCard.js
    ├── RefreshCard.js
    ├── MetricCard.js
    ├── TimelineCard.js
    ├── TopicClustersCard.js
    ├── AIInsightsCard.js
    ├── LiveMentionsFeedCard.js
    ├── HelpCard.js
    ├── SentimentCard.js
    ├── LiveAlertsCard.js
    ├── RealTimeActivityCard.js
    ├── PlatformDistributionCard.js
    ├── QuickStatsCard.js
    └── README.md                     # This file
```

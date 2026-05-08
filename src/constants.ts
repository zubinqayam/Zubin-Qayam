import { ALGAReport } from './types/alga';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FileTreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  starred?: boolean;
  active?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  optimizationProposal?: OptimizationProposal;
  isStreaming?: boolean;
  algaReport?: ALGAReport;
  meta?: {
    provider: string;
    latency: number;
    cost?: number;
    assignedAgents?: string[];
  };
}

export interface OptimizationProposal {
  id: string;
  module: string;
  context: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  proposalText: string;
  diff?: {
    add: string[];
    remove: string[];
  };
  status: 'pending' | 'applied' | 'rejected';
}

export const INITIAL_FILE_TREE: FileTreeNode[] = [
  {
    id: 'project-alpha',
    name: 'Project Alpha',
    type: 'folder',
    starred: true,
    children: [
      {
        id: 'planning',
        name: 'Planning',
        type: 'folder',
        children: []
      },
      {
        id: 'development',
        name: 'Development',
        type: 'folder',
        active: true,
        children: [
          {
            id: 'api',
            name: 'API',
            type: 'file',
            starred: true
          },
          {
            id: 'ui',
            name: 'UI',
            type: 'file'
          }
        ]
      }
    ]
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'What would you like to work on here in the Development context?',
    timestamp: '10:40 AM'
  },
  {
    id: '2',
    role: 'user',
    content: 'optimize API endpoints for speed',
    timestamp: '10:41 AM'
  },
  {
    id: '3',
    role: 'assistant',
    content: "Analyzing API traces... N+1 query detected in `/v1/users/profile` endpoint. Here's a proposal to optimize this using eager loading and caching.",
    timestamp: '10:42 AM',
    optimizationProposal: {
      id: 'prop-1',
      module: 'API',
      context: 'Development',
      priority: 'High',
      description: 'Identified bottlenecks in data serialization and relational queries. Propose implementing eager loading for user roles and adding a Redis caching layer for static data.',
      proposalText: 'Switch to .includes(:roles) and implement a 1-hour Redis cache for session-based data metadata.',
      diff: {
        remove: [
          'users = User.all()',
          'roles = [u.role for u in users]'
        ],
        add: [
          'users = User.includes(:roles).all()',
          'cache.set("static_config", config, ex=3600)'
        ]
      },
      status: 'pending'
    }
  }
];

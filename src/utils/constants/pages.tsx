/*-
 *
 * Tools Landing Page
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { dictionary } from '@/libs/en';

export const pages = [
  {
    name: dictionary.pages.airdropListVerifier,
    url: 'airdropListVerifier',
  },
  {
    name: dictionary.pages.metadataValidator,
    url: 'metadataValidator',
  },
  {
    name: dictionary.pages.nftRarityInspector,
    url: 'nftRarityInspector',
  },
  {
    name: dictionary.pages.nftTokenHoldersListBuilder,
    url: 'nftTokenHoldersListBuilder',
  },
  {
    name: dictionary.pages.riskInspector,
    url: 'riskInspector',
  },
  {
    name: dictionary.pages.tokenBalanceSnapshot,
    url: 'tokenBalanceSnapshot',
  },
];

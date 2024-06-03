/*-
 *
 * Token Balance Snapshot
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

import { TokenDetails } from '@/types/tokenDetails-response';
import { nodeUrl } from '@/utils/const';

export const createFetchUrl = (tokenId: string, tokenDetailsList: TokenDetails[], isDurationSelect: boolean, minAmount?: string, duration?: Date) => {
  const currentTokenDetails = tokenDetailsList?.find((token) => token.token_id === tokenId);
  const amount = Number(minAmount) * Math.pow(10, Number(currentTokenDetails?.decimals));
  let url = `${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${amount}&limit=200`;

  if (isDurationSelect && duration) {
    const timestamp = Math.floor(duration.getTime() / 1000);
    url += `&timestamp=${timestamp}`;
  }

  return url;
};

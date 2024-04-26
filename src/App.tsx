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
import { Layout } from '@/Layout';
import { Button } from '@/components/ui/button';
import { dictionary } from '@/libs/en';
import { pages } from '@/utils/constants/pages';

const App = () => {
  return (
    <Layout>
      <h1 className="mt-20 scroll-m-20 text-center text-[28px] font-extrabold tracking-tight sm:text-4xl md:text-5xl">{dictionary.title}</h1>
      <p className="mb-6 text-center text-[12px] leading-7 sm:text-[14px] md:text-[16px] [&:not(:first-child)]:mt-6">{dictionary.description}</p>
      <div className="mt-16 flex flex-col gap-6">
        {pages.map(({ name, url }) => (
          <div key={name} className="mx-auto">
            <a href={url} target="_blank" rel="noreferrer">
              <Button className="w-[500px] py-8 text-lg transition duration-200 hover:scale-105">{name}</Button>
            </a>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default App;

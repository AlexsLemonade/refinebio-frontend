import React from 'react';
import Head from 'next/head';

const Privacy = () => (
  <div className="layout__content terms">
    <Head>
      <title>License - refine.bio</title>
    </Head>
    <h1 className="terms__title">BSD 3-Clause License</h1>
    <p>
      Copyright &copy; 2017-2018, Greene Laboratory, University of Pennsylvania
      and Childhood Cancer Data Lab, Alex's Lemonade Stand Foundation. All
      rights reserved.
    </p>

    <p>
      Redistribution and use in source and binary forms, with or without
      modification, are permitted provided that the following conditions are
      met:
    </p>

    <ol className="terms__list">
      <li>
        Redistributions of source code must retain the above copyright notice,
        this list of conditions and the following disclaimer.
      </li>
      <li>
        Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
      </li>
      <li>
        Neither the name of the copyright holder nor the names of its
        contributors may be used to endorse or promote products derived from
        this software without specific prior written permission.
      </li>
    </ol>
    <p className="terms__caps">
      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
      IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
      THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
      PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
      CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
      EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
      PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
      PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
      LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
      NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
      SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    </p>
  </div>
);

export default Privacy;

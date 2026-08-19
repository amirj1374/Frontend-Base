export { fakeBackend };

// interface ResponseBody {
//   id: number;
//   username: string;
//   firstName: string;
//   lastName: string;
//   token: string;
// }

function fakeBackend() {
  const customers = [
    {
      id: 1, firstName: 'امیر', lastName: 'جلیلی', nationalCode: '0018523897', personType: 'حقیقی',
      personRelationType: 'ویژه', customerType: 'کاسپین', address: 'تهران, ایران', postalCode: '1111111111',
      name: '021-12345678', branchName: 'تختی', branchCode: '1054'
    },
  ];

  const realFetch = window.fetch;

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const requestUrl = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
    const requestMethod = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

    if (!requestUrl.endsWith('/customers/search') || requestMethod !== 'POST') {
      return realFetch.call(window, input, init);
    }

    return new Promise<Response>((resolve) => {
      window.setTimeout(() => {
        const requestBody = typeof init?.body === 'string' ? JSON.parse(init.body) : {};
        const { nationalCode, personType } = requestBody;
        const results = customers.filter(
          (customer) =>
            (!nationalCode || customer.nationalCode.includes(nationalCode)) &&
            (!personType || customer.personType === personType)
        );
        resolve(new Response(JSON.stringify(results), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }, 500);
    });
  } as typeof window.fetch;
}


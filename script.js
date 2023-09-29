const environment = {
    clientid: "",
    clientid_pwd: "",
    bm_user: "",
    bm_pwd_clientid_pwd: "",
    Authorization_key: "", 
    host_server: "",
    site_id: "",
    origin_url: "", 
    data_url: "",
    shop_url: "",
  };
  async function performRequest(requestData) {
    try {
      const response = await fetch(requestData.url, {
        method: requestData.method,
        headers: requestData.headers,
        body: requestData.body,
      });
  
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  
  async function getOAuth2Token() {
    const url = "https://account.demandware.com/dw/oauth2/access_token";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(environment.clientid + ":" + environment.clientid_pwd),
    };
    const body = "grant_type=client_credentials";
  
    const tokenData = await performRequest({ url, method: "POST", headers, body });
    if (tokenData && tokenData.access_token && tokenData.token_type) {
      environment.Authorization_key = tokenData.token_type + " " + tokenData.access_token;


     localStorage.setItem("access_token", environment.Authorization_key);
     console.log("access_token saved to cache");
     






    }     
  }
  
  getOAuth2Token();
  

  


async function getCategories() {
    try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = environment.shop_url + '/categories/root?levels=2';
        
        const response = await fetch(proxyUrl+apiUrl, {
            method: 'GET',
            headers: {
              'x-dw-client-id': ""+environment.clientid+""
            }
        });
        if (response.ok) {
            const categoriesData = await response.json();

            const outputElement = document.getElementById('output');

            const categories = categoriesData.categories;
            const categoryListHTML = categories.map(category => {
              
                if (category.categories && category.categories.length > 0) {
                    return `
                        <div class="category">
                            <img src="${category.categories[1].image}" alt="${category.name}" />
                            <h3>${category.name}</h3>
                        </div>
                    `;
                }
                return console.log('No Data');; 
            }).join('');

            outputElement.innerHTML = categoryListHTML; 

        } else {
            console.error('Failed to fetch categories:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

getCategories();









  async function getWebsitesWithProxy() {
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = environment.data_url+'/sites';
      await new Promise(resolve => setTimeout(resolve, 2000));
      const tt = environment.Authorization_key;
      const response = await fetch(proxyUrl + apiUrl, {
        method: 'GET',
        headers: {
          'x-dw-client-id': ''+environment.clientid+'',
          'Authorization': ''+tt+'',
          'Origin': 'http://localhost:8080',
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest' 
        }
      });
  
      if (response.ok) {
        const websitesData = await response.json();

        const outputElement = document.getElementById('websitesOutput');

        const websiteHTML = websitesData.data.map(website => `
            <div class="website">
                <a href="${website.link}" target="_blank">${website.id}</a>
            </div>
        `).join('');

        outputElement.innerHTML = websiteHTML;



      } else {
        console.error('Failed to fetch websites:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  getWebsitesWithProxy();
  







///////////orders:






  async function getorders() {
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = environment.shop_url+'/order_search';
      await new Promise(resolve => setTimeout(resolve, 2000));
      const tt = environment.Authorization_key;
      const requestBody = {
        query: {
          text_query: {
            fields: ['customer_email'],
            search_phrase: "contact@korchi.me"
          }
        },
        select: "(**)",
        sorts: [{ field: "customer_name", sort_order: "asc" }]
      };
      const response = await fetch(proxyUrl+apiUrl, {
        method: 'POST',
        headers: {
          'x-dw-client-id': ''+environment.clientid+'',
          'Authorization': ''+tt+'',
          'Origin': 'http://127.0.0.1:8000',
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest' 
        },
        body: JSON.stringify(requestBody)
      });
      if (response.ok) {
        const orderesData = await response.json();

        const outputElement = document.getElementById('ordersOutput');
        const hits = orderesData.hits;


        let tableHTML = '<table>';
  
        tableHTML += '<tr>';
        tableHTML += '<th>Order Number</th>';
        tableHTML += '<th>Customer Name</th>';
        tableHTML += '<th>Email</th>';
        tableHTML += '<th>Order Total</th>';
        tableHTML += '<th>Payment Status</th>';
        tableHTML += '<th>Shipping Status</th>';
        tableHTML += '</tr>';
        
        hits.forEach((hit) => {
          const order = hit.data;
          tableHTML += '<tr>';
          tableHTML += `<td>${order.order_no}</td>`;
          tableHTML += `<td>${order.customer_name}</td>`;
          tableHTML += `<td>${order.customer_info.email}</td>`;
          tableHTML += `<td>${order.order_total}</td>`;
          tableHTML += `<td>${order.payment_status}</td>`;
          tableHTML += `<td>${order.shipping_status}</td>`;
          tableHTML += '</tr>';
        });
        
        tableHTML += '</table>';
        outputElement.innerHTML = tableHTML;
      } else {
        console.error('Failed to fetch orders:', response.status, response.statusText);

      }
    } catch (error) {
      console.error('An error occurred:', error);

    }
  }
  
  getorders();
  





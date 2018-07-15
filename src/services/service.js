const service = {
    getToken: () => {
        let data = new URLSearchParams();
        data.append('grant_type', 'client_credentials');
        data.append('scope', 'api.market');

        return new Promise((resolve, reject) => {
            fetch("https://cors-anywhere.herokuapp.com/https://id.livevol.com/connect/token", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Authorization": "Basic " + btoa('web_api_demo:KM83bv!kqa'),
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/x-www-form-urlencoded",
                },
                body: data
            }).then(response => response.json()).then((result) => {
                if (result && !result.error) {
                    resolve(result.access_token);
                } else {
                    reject(result.error);
                }
            }).catch(error => {
                reject(error)
            });
        });
    },
    getData: (startDate, endDate, symbol, token) => {
        return new Promise((resolve, reject) => {
            fetch("https://api.livevol.com/v1/delayed/market/symbols/" + symbol + "/history?start_date=" + startDate.format('YYYY-MM-DD') + "&end_date=" + endDate.format('YYYY-MM-DD'), {
                method: "GET",
                mode: "cors",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then(response => response.json()).then((results) => {
                resolve(results);
            }).catch(error => reject(error));
        });
    }
};

export default service;
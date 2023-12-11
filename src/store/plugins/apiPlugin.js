import axios from "axios";

export const apiPlugin = (store) => {
  store.http = axios.create({ baseURL: SERVER_URL });

  store.getData = async function (url) {
    try {
      const response = await this.http.get(url);

      let data = {
        data: response.data,
        total: parseInt(response.headers["x-total-count"]),
      };

      return data;
    } catch (error) {
      throw new Error("There was a problem fetching data from the server.");
    }
  };

  store.postData = async function (url, data) {
    try {
      const response = await this.http.post(url, data);
      return response;
    } catch (error) {
      throw new Error(`There was a problem creating data.`);
    }
  };

  store.deleteData = async function (url, id) {
    try {
      const response = await this.http.delete(`${url}/${id}`);
      return response;
    } catch (error) {
      throw new Error(`There was a problem while trying to remove data.`);
    }
  };

  store.updateData = async function (url, id, data) {
    try {
      const response = await this.http.put(`${url}/${id}`, data);
      return response;
    } catch (error) {
      throw new Error(`There was a problem while trying to update data.`);
    }
  };
};

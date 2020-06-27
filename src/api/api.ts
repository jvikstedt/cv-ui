import axios from "axios";

class Api {
  baseURL = process.env.VUE_APP_ENDPOINT;
  config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VUE_APP_TOKEN}`
    }
  };

  async get(uri: string) {
    const response = await axios.get(`${this.baseURL}${uri}`, this.config);

    return response.data;
  }

  async delete(uri: string) {
    const response = await axios.delete(`${this.baseURL}${uri}`, this.config);

    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post(uri: string, body: any) {
    const response = await axios.post(
      `${this.baseURL}${uri}`,
      body,
      this.config
    );

    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put(uri: string, body: any) {
    const response = await axios.put(
      `${this.baseURL}${uri}`,
      body,
      this.config
    );

    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async patch(uri: string, body: any) {
    const response = await axios.patch(
      `${this.baseURL}${uri}`,
      body,
      this.config
    );

    return response.data;
  }
}

const api = new Api();
export default api;

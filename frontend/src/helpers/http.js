const domain = "http://localhost:3000/api";
export const http = async (urlApi, method, dataRequest) => {
  try {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["authorization"] = `Bearer ${token}`;
    }
    let response = await fetch(`${domain}${urlApi}`, {
      method: method,
      headers,
      body: JSON.stringify(dataRequest),
    });
    if (refreshToken && token && response.status == 401) {
      const fetchRefreshToken = await fetch(`${domain}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      const dataRefresh = await fetchRefreshToken.json();
      localStorage.setItem("token", dataRefresh.data.access_token); // Lưu token vào localStorage
      localStorage.setItem("refresh_token", dataRefresh.data.refresh_token); // Lưu token vào localStorage
      headers["authorization"] = `Bearer ${dataRefresh.data.access_token}`;
      response = await fetch(`${domain}${urlApi}`, {
        method: method,
        headers,
        body: JSON.stringify(dataRequest),
        // credentials: "include", // Gửi cookies khi gọi API
      });
    }
    const data = await response.json();
    return {
      status: response.status,
      data: data.data,
    };
  } catch (error) {
    console.error(error);
  }
};

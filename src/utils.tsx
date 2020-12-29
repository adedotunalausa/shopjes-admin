const API_URL = process.env.REACT_APP_API_URL

export const callApi = async (path: string, method: string, body: any) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "content-type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
  })
  const data = await response.json();

  return data;
}
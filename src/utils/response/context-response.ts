function response(status: number, data: any) {
  return {
    status,
    headers: {
      'Content-type': 'application-json',
    },
    body: data,
  };
}

export { response };

export default {
  fetch() {
    return new Response("test", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
};

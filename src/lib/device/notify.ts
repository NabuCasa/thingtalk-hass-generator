export const ACTIONS = {
  notify: () => {
    return {
      automation: { service: "notify.notify", message: "", target: "" }
    };
  }
};

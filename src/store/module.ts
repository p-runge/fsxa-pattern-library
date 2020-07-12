export interface ModuleState {
  state: "initialize" | "initialized" | "error";
}

const state: ModuleState = {
  state: "initialize",
};

import FSXABaseComponent from "./FSXABaseComponent";

class Page extends FSXABaseComponent<{}> {
  loadingPage: string | null = null;

  serverPrefetch() {
    return this.fetchData();
  }

  async fetchData() {
    return null;
  }

  render() {
    return <div>Page</div>;
  }
}
export default Page;

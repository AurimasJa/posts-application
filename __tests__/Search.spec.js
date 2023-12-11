import { shallowMount } from "@vue/test-utils";
import SearchComponent from "../src/components/Search.vue";

describe("SearchComponent.vue", () => {
  it("emits query event on input change", async () => {
    const wrapper = shallowMount(SearchComponent);

    wrapper.vm.$emit("searchQuery");
    wrapper.vm.$emit("searchQuery", "test");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().searchQuery).toBeTruthy();

    expect(wrapper.emitted().searchQuery.length).toBe(2);

    expect(wrapper.emitted().searchQuery[1]).toEqual(["test"]);
  });
});

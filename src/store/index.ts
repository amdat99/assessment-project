import Vue from "vue";
import Vuex from "vuex";
import { getUserDataById } from "@/core/getUserDataById";
import { Address, Claim, User } from "@/types";
import { createClaim } from "@/core/createClaim";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userData: null as User | null,
    claims: [] as Claim[],
  },
  getters: {
    userData: (state) => state.userData,
    claims: (state) => state.claims,
  },
  mutations: {
    SET_USER_DATA(state, data: User) {
      state.userData = data;
    },
    ADD_CLAIM(state, claim: Claim) {
      state.claims.push(claim);
    },
  },
  actions: {
    async fetchUserData({ commit }, userId: string) {
      try {
        const [userData, error] = await getUserDataById(userId);
        if (error || !userData) throw error;
        commit("SET_USER_DATA", userData);
      } catch (error) {
        commit("SET_USER_DATA", null);
        throw error;
      }
    },
    async onCreateClaim({ commit, state }, addressData: Address[]) {
      try {
        if (!state.userData) throw new Error("User data not found");

        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        if (!ipData.ip) throw new Error("Failed to fetch IP address");

        const [newClaim, error] = await createClaim(
          state.userData?.id,
          ipData.ip,
          addressData
        );
        if (error || !newClaim) throw error;

        const finalClaim = JSON.parse(JSON.stringify(newClaim));

        commit("ADD_CLAIM", finalClaim);
      } catch (error) {
        console.error("Failed to create claim", error);
        throw error;
      }
    },
  },
  modules: {},
});

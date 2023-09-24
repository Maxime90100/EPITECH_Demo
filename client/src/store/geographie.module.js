import {getRequest} from "@/services/axios.service";
import {getLocalisationCoordinates} from "@/services/localisation.service";

export default {
    namespaced: true,
    state: {
        regions: [],
        regionsOnLoad: false,
        selectedRegion: null,
        selectedRegionId: null,
        departements: [],
        departementsOnLoad: false,
        selectedDepartement: null,
        selectedDepartementId: null,
        communes: [],
        communesOnLoad: false,
        selectedCommune: null,
        selectedCommuneId: null,
        allCommunes: [],
        populationLegend: null
    },
    mutations: {
        setRegions(state, regions){
            state.regions = regions;
        },
        regionsLoading(state){
            state.regionsOnLoad = true;
        },
        regionsReady(state){
            state.regionsOnLoad = false;
        },
        setSelectedRegionId(state,regionId) {
            state.selectedRegionId = regionId;
            state.selectedRegion = state.regions.find(e => e.code === regionId);
        },
        setDepartements(state, departements){
            state.departements = departements;
        },
        departementsLoading(state){
            state.departementsOnLoad = true;
        },
        departementsReady(state){
            state.departementsOnLoad = false;
        },
        setSelectedDepartementId(state,departementId) {
            state.selectedDepartementId = departementId;
            state.selectedDepartement = state.departements.find(e => e.code === departementId);
        },
        setCommunes(state, communes){
            state.communes = communes;
        },
        communesLoading(state){
            state.communesOnLoad = true;
        },
        communesReady(state){
            state.communesOnLoad = false;
        },
        setSelectedCommuneId(state,communeId) {
            state.selectedCommuneId = communeId;
            state.selectedCommune = state.communes.find(e => e.code === communeId);
        },
        setAllCommunes(state, communes){
            state.allCommunes = communes;
        },
        setPopulationLegend(state, legend){
            state.populationLegend = legend;
        },
    },
    actions: {
        async initializeGeographieModule({state,dispatch}){
            if(state.regions.length === 0) {
                dispatch('getAllRegions');
            }
        },
        async getMapCommunes({commit}){
            const communes = await getRequest('/geographie/communes');
            commit('setAllCommunes', communes.communes);
            commit('setPopulationLegend', communes.legend);
        },
        async getAllRegions({commit}){
            commit('regionsLoading');
            const regions = await getRequest('/geographie/regions');
            commit('setRegions',regions);
            commit('regionsReady');
        },
        async setRegion({commit,dispatch},regionId){
            commit('setSelectedRegionId',regionId);
            commit('setSelectedDepartementId',null);
            commit('setDepartements',[]);
            await dispatch('getAllDepartements', regionId);
            commit('setSelectedCommuneId',null);
            commit('setCommunes',[]);
        },
        async getAllDepartements({commit},idRegion){
            if(idRegion){
                commit('departementsLoading');
                const departements = await getRequest(`/geographie/regions/${idRegion}/departements`);
                commit('setDepartements',departements);
                commit('departementsReady');
            }
        },
        async setDepartement({commit,dispatch},{regionId, departementId}){
            commit('setSelectedDepartementId',departementId);
            commit('setSelectedCommuneId',null);
            commit('setCommunes',[]);
            await dispatch('getAllCommunes', {idRegion:regionId,idDepartement:departementId});
        },
        async getAllCommunes({commit}, {idRegion,idDepartement}){
            if(idRegion && idDepartement){
                commit('communesLoading');
                const communes = await getRequest(`/geographie/regions/${idRegion}/departements/${idDepartement}/communes`);
                commit('setCommunes',communes);
                commit('communesReady');
            }
        },
        async setCommune({commit},communeId){
            commit('setSelectedCommuneId',communeId);
        },
        async getLocalisation({dispatch}){
            const coords = await getLocalisationCoordinates();
            if(coords.error){
                alert(coords.error);
            } else {
                const commune = (await getRequest(`geographie/localisation/commune?longitude=${coords.longitude}&latitude=${coords.latitude}`))[0];
                await dispatch('setRegion',commune.codeRegion);
                await dispatch('setDepartement',{ regionId: commune.codeRegion, departementId: commune.codeDepartement });
                await dispatch('setCommune',commune.code);
            }
        }
    }
}

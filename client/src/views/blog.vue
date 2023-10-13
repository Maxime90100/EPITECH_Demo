<script>
import authentication from "@/components/navigation/authentication.vue";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

export default {
  components:{
    authentication
  },
  mounted() {
    if(this.user) {
      this.syncBlogs()
      this.syncOtherBlogs()
    }
  },
  watch:{
    user(newValue){
      if(newValue) {
        this.syncBlogs()
        this.syncOtherBlogs()
      } else {
        this.clearAll()
      }
    },
    selectedBlog(){
      this.showOtherBlogsDialog = false
    }
  },
  computed:{
    ...mapState(['user','currentTheme']),
    ...mapState('blogModule',['blogs','otherBlogs','selectedBlog','newBlog','message']),
    ...mapGetters('blogModule',['getColors','getSelectedBlog']),
    text:{
      get(){return this.message},
      set(text){this.setMessage(text)}
    }
  },
  data:()=>{
    return{
      addBlogDialog: false,
      showOtherBlogsDialog: false
    }
  },
  methods:{
    ...mapMutations('blogModule',['clearAll','setSelectedBlog','clearSelectedBlog','setMessage']),
    ...mapActions('blogModule',['syncBlogs','syncOtherBlogs','addBlog','deleteBlog','addMessage']),
    addNewBlog(){
      this.addBlog()
      this.addBlogDialog = false;
    },
    DateToHour(date){
      return (date.split('T')[1]).split('.')[0];
    }
  }
};
</script>

<template>
  <div>
    <authentication/>
    <div v-if="user">
      <v-card
          class="mx-auto"
          max-width="80vw"
      >
        <!-- header -->
        <v-card-item
            :style="`background-color: ${selectedBlog ? selectedBlog.color : currentTheme.colors.primary}`"
        >
          <v-card-title>
            {{ selectedBlog ? selectedBlog.title : 'Mes blogs' }}
            <v-btn
                v-if="!selectedBlog"
                icon="mdi-post-outline"
                variant="plain"
                @click="showOtherBlogsDialog = true"
            />
          </v-card-title>

          <template v-slot:append>
            <v-btn
                color="white"
                :icon="selectedBlog ? 'mdi-arrow-left' : 'mdi-plus'"
                size="small"
                @click="selectedBlog ? clearSelectedBlog() : this.addBlogDialog = true"
            ></v-btn>
          </template>
        </v-card-item>

        <!-- show blogs of user -->
        <v-virtual-scroll
            v-if="!selectedBlog"
            :items="blogs"
            height="50vh"
            item-height="50"
        >
          <template v-slot:default="{ item : blog }">
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar
                    :color="blog.color"
                    class="text-white"
                    size="20"
                />
              </template>

              <v-list-item-title>{{ blog.title }}</v-list-item-title>

              <v-list-item-subtitle>{{ blog.description }}</v-list-item-subtitle>

              <template v-slot:append>
                <v-btn
                    size="small"
                    variant="tonal"
                    @click="setSelectedBlog(blog)"
                    icon="mdi-open-in-new"
                    :color="blog.color"
                />
                <v-btn
                    size="small"
                    variant="text"
                    @click="deleteBlog(blog._id)"
                    icon="mdi-delete-outline"
                    color="red"
                />
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>

        <!-- show messages of selected blog -->
        <v-virtual-scroll
            ref="virtualScrollMessages"
            v-if="selectedBlog"
            :items="getSelectedBlog"
            height="50vh"
            item-height="50"
        >
          <template v-slot:default="{ item: messageGroup }">

            <v-list-subheader>{{ messageGroup.date }}</v-list-subheader>
            <v-divider/>

            <v-list-item
                v-for="message in messageGroup.messages"
                :key="message._id"
            >
              <!-- Other user -->
              <template v-slot:prepend v-if="message.user._id !== user._id">
                <v-avatar :color="selectedBlog.color" class="text-white" size="30">
                  <span>{{ message.user.username[0].toUpperCase() }}</span>
                </v-avatar>
              </template>
              <!-- User -->
              <template v-slot:append v-else>
                <v-avatar color="primary" class="text-white" size="30">
                  <span>{{ message.user.username[0].toUpperCase() }}</span>
                </v-avatar>
              </template>

              <div :align="message.user._id !== user._id ? 'left' : 'right'">
                <v-list-item-title>{{ message.text }}</v-list-item-title>
                <v-list-item-subtitle>{{ message.user._id === user._id ? '' : `${message.user.username}` }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ DateToHour(message.createdAt) }}</v-list-item-subtitle>
              </div>

            </v-list-item>
          </template>
        </v-virtual-scroll>

        <!-- text barre -->
        <form
            v-if="selectedBlog"
            @submit.prevent="addMessage"
        >
          <v-text-field
              v-model="text"
              density="compact"
              variant="solo"
              label="Ecrire un message ..."
              append-inner-icon="mdi-send-variant"
              single-line
              hide-details
              @click:append-inner="addMessage"
          ></v-text-field>
        </form>
      </v-card>

      <!-- add blog dialog -->
      <v-dialog
          v-model="addBlogDialog"
          width="auto"
          persistent
      >
        <v-card>
          <v-card>
            <form @submit.prevent="addNewBlog">
              <v-card-title>
                <span class="text-h5">Créer un nouveau blog</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                          label="Titre"
                          v-model="newBlog.title"
                          required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                          label="Description"
                          v-model="newBlog.description"
                          required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="9">
                      <v-color-picker
                          v-model="newBlog.color"
                          hide-inputs
                      />
                    </v-col>
                    <v-col cols="3">
                      <h3>Vos couleurs</h3>
                      <v-radio-group v-model="newBlog.color">
                        <v-radio
                            v-for="color in getColors"
                            :value="color"
                            :color="color"
                            :style="{ color: color }"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    text="Annuler"
                    @click="addBlogDialog = false"
                />
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    text="Créer"
                    type="submit"
                />
              </v-card-actions>
            </form>
          </v-card>
        </v-card>
      </v-dialog>

      <!-- show other blogs dialog -->
      <v-dialog
          v-model="showOtherBlogsDialog"
          width="50vw"
          persistent
      >
        <v-card>
          <v-card>
            <v-card-title>
              <span class="text-h5">Autres blogs</span>
            </v-card-title>
            <v-virtual-scroll
                :items="otherBlogs"
                height="50vh"
                item-height="50"
            >
              <template v-slot:default="{ item : blog }">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-avatar
                        :color="blog.color"
                        class="text-white"
                        size="20"
                    />
                  </template>

                  <v-list-item-title>{{ blog.title }}</v-list-item-title>

                  <v-list-item-subtitle>{{ blog.description }}</v-list-item-subtitle>

                  <template v-slot:append>
                    <v-btn
                        size="small"
                        variant="tonal"
                        @click="setSelectedBlog(blog)"
                        icon="mdi-open-in-new"
                        :color="blog.color"
                    />
                  </template>
                </v-list-item>
              </template>
            </v-virtual-scroll>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue-darken-1"
                  variant="text"
                  text="Mes blogs"
                  @click="showOtherBlogsDialog = false"
              />
            </v-card-actions>
          </v-card>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

import axios from "axios";

export default {
  getSomeThing: function (argument) {
    return axios.get('/api/some/route');
  }
}
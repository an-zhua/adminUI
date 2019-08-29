<template>
  <Form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           :label-width="0">
    <FormItem prop="username">
      <Input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.username"
                auto-complete="off"
                placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input size="small"
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code">
      <Row :span="24">
        <Col :span="16">
          <Input size="small"
                    @keyup.enter.native="handleLogin"
                    :maxlength="code.len"
                    v-model="loginForm.code"
                    auto-complete="off"
                    placeholder="请输入验证码">
            <span slot="prepend">
                <Icon :size="14" type="md-code"></Icon>
            </span>
          </Input>
        </Col>
        <Col :span="8">
          <div class="login-code">
            <span class="login-code-img"
                  @click="refreshCode"
                  v-if="code.type == 'text'">{{code.value}}</span>
            <img :src="code.src"
                 class="login-code-img"
                 @click="refreshCode"
                 v-else />
          </div>
        </Col>
      </Row>

    </FormItem>
    <FormItem>
      <Button type="primary"
                 size="small"
                 @click="handleSubmit"
                 class="login-submit">登录</Button>
    </FormItem>
  </Form>
</template>

<script>
import { randomLenNum, encrypt } from "@/libs/util"
import { mapActions } from "vuex"
export default {
  name: "userlogin",
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.code.value != value) {
        this.loginForm.code = "";
        this.refreshCode();
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "maple",
        password: "123456",
        code: "",
        redomStr: ""
      },
      code: {
        src: "",
        value: "",
        len: 4,
        type: "text"
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateCode }
        ]
      },
      passwordType: "password"
    };
  },
  created() {
    this.refreshCode();
  },
  mounted() {},
  computed: {
  },
  props: [],
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    refreshCode() {
      this.loginForm.redomStr = randomLenNum(this.code.len, true);
      this.code.type == "text"
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}/${this.loginForm.redomStr}`);
      this.loginForm.code = this.code.value;
    },
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
            this.$Loading.start();
            let data = Object.assign({}, this.loginForm)
            data.password = encrypt(data.password)
            console.log(data)
            this.handleLogin(data).then(res => {
                this.getUserInfo().then(res => {
                    this.$router.push({
                        name: this.$config.homeName
                    })
                })
                this.$Loading.finish();
            })
        }
      });
    }
  }
};
</script>

<style>
</style>
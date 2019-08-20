<template>
  <Tabs>
    <TabPane label="基础信息" name="baseInfo">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="姓名" prop="nickName">
            <Input v-model="formValidate.nickName" placeholder="请输入姓名"></Input>
          </FormItem>
          <FormItem label="用户名" prop="userName">
            <Input v-model="formValidate.userName" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem label="头像" prop="avatar">
            <div class="upload-list" v-for="(item, index) in uploadList" v-bind:key="index">
              <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item.bucketName, item.name)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
              </template>
              <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="uploadList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="500"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                action="//user/minio/object/user"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
            <Modal title="View Image" v-model="visible">
                <img :src="'/user/minio/download/' + bucketName + '/' + imgName + ''" v-if="visible" style="width: 100%">
            </Modal>
          </FormItem>
          <FormItem label="手机号" prop="phone">
            <Input v-model="formValidate.userName" placeholder="请输入手机号"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
          </FormItem>
          <FormItem label="个性签名" prop="content">
            <Input
              v-model="formValidate.content"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="Enter something..."
            ></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
    </TabPane>
    <TabPane label="密码修改" name="password">
      <Form ref="formPasswd" :model="formPasswd" :rules="rulePasswd" :label-width="80">
        <FormItem label="旧密码" prop="oldpasswd">
            <Input type="password" v-model="formPasswd.oldpasswd"></Input>
        </FormItem>
        <FormItem label="新密码" prop="passwd">
            <Input type="password" v-model="formPasswd.passwd"></Input>
        </FormItem>
        <FormItem label="密码确认" prop="passwdCheck">
            <Input type="password" v-model="formPasswd.passwdCheck"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formPasswd')">提交</Button>
            <Button @click="handleReset('formPasswd')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </TabPane>
  </Tabs>
</template>
<script>
import { updateUser, updatePasswd } from '@/api/user'
import { mapGetters } from 'vuex'
import { encrypt } from '@/libs/util'
export default {
  name: 'info_page',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('新密码不能为空'));
      } else {
        if (this.formCustom.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck');
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空'));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('两次密码不匹配'));
      } else {
        callback();
      }
    };
    return {
      formPasswd: {
        passwd: '',
        passwdCheck: '',
        oldpasswd: ''
      },
      uploadList: [],
      imgName: '',
      bucketName: '',
      visible: false,
      formValidate: {
        id: '',
        nickName: '',
        userName: '',
        avatar: '',
        email: '',
        phone: '',
        content: ''
      },
      ruleValidate: {
        nickName: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        userName: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      },
      rulePasswd: {
        passwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        oldpasswd: [
          { required: true, message: '当前密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (name === 'formValidate') {
            let data = this.formValidate
            updateUser(data).then(res => {
              this.$Message.success(res.data.msg)
            }).catch(err => {
              this.$Message.success('提交失败,请重试')
            })
          } else if (name === 'formPasswd') {
            let data = {}
            data.oldPasswd = encrypt(this.formPasswd.oldpasswd)
            data.passwd = encrypt(this.formPasswd.passwd)
            updatePasswd(data).then(res => {
              this.$Message.success(res.data.msg)
            }).catch(err => {
              this.$Message.success('提交失败,请重试')
            })
          }
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleView (bucketName, name) {
      this.bucketName = bucketName
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.formValidate.avatar = null
    },
    handleSuccess (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
      this.formValidate.avatar = file.url
    },
    handleFormatError (file) {
      this.$Notice.warning({
          title: '文件格式不合法',
          desc: '文件' + file.name + '格式不合法,请选择[jpg|png]格式.'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
          title: '文件大小限制',
          desc: '文件' + file.name + '太大,不能超过500K.'
      });
    },
    handleBeforeUpload () {
        const check = this.uploadList.length < 1;
        if (!check) {
            this.$Notice.warning({
                title: '只能上传一个文件,请删除原文件再上传'
            });
        }
        return check;
    }
  },
  created () {
    this.formValidate.id = this.$store.state.userInfo.id
    this.formValidate.nickName = this.$store.state.userInfo.nickName
    this.formValidate.userName = this.$store.state.userInfo.userName
    this.formValidate.avatar = this.$store.state.userInfo.avatar
    this.formValidate.email = this.$store.state.userInfo.email
    this.formValidate.phone = this.$store.state.userInfo.phone
    this.formValidate.content = this.$store.state.userInfo.content

    if(this.formValidate.avatar) {
      let avatarObj = Object.assign({}, this.formValidate.avatar)
      let avatarArr = avatarObj.split('/')
      let avatar = {}
      avatar.bucketName = avatarArr[1]
      avatar.name = avatarArr[avatarArr.length -1]
      avatar.url = this.formValidate.avatar
      this.uploadList.put(avatar)
    }
    
  }
}
</script>
<style scoped>
  .upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .upload-list img{
    width: 100%;
    height: 100%;
  }
  .upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .upload-list:hover .upload-list-cover{
      display: block;
  }
  .upload-list-cover i{
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
  }
</style>
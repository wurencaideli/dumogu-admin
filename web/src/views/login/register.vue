<script>
/** 
 * 注册页面
 *  */
import { defineComponent,ref,reactive, computed,onMounted } from "vue";
import userApi from '@/common/http/Api';
import publicApi from '@/common/http/Public';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute,useRouter } from 'vue-router';
import {throttleFn_1 as throttleFn} from '@/common/DebounceAndThrottle';
import { verifiedData } from "@/common/VerifiedTools";
import { enEmojiData,deEmojiData } from "@/common/Emoji";
import { ArrowRightBold } from '@element-plus/icons-vue';
import {userData as userDataStore} from "@/store/user";
import SearchContainer from "./components/SearchContainer.vue";

export default defineComponent({
    name:'RegisterView',
    components: {
        ArrowRightBold,
        SearchContainer,
    },
    setup(){
        const userData = userDataStore();
        const router = useRouter();
        const FormElRef = ref(null);
        const dataContainer = reactive({
            form: {
                nickname:'',
                name:'',
                password:'',
                overTime:'',
                captchaText:'',
            },
            rules: {
                name: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                password_:[
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { 
                        validator:(rule,value,callBack)=>{
                            if(value !== dataContainer.form.password){
                                callBack(new Error('两次密码不一致'));
                            }else{
                                callBack();
                            }
                        }, 
                        trigger: 'blur',
                    },
                ],
                nickname: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                ],
                captchaText: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ],
            },
            loading:false,
            captchaSvg:'',
            captchaId:'',
            loading_1:false,
        });
        /** 验证信息 */
        function validBase(data){
            const failData = verifiedData(data,{
                name:{
                    label:'账号 : 不能为空 && 长度1-150',
                    validate(value){
                        if(!value && value !== 0) return false;
                        value = String(value);
                        if(value.length < 1) return false;
                        if(value.length > 150) return false;
                        return true;
                    },
                },
                password:{
                    label:'密码 : 不能为空 && 长度1-150',
                    validate(value){
                        if(!value && value !== 0) return false;
                        value = String(value);
                        if(value.length < 1) return false;
                        if(value.length > 150) return false;
                        return true;
                    },
                },
                nickname:{
                    label:'昵称 : 不能为空 && 长度1-150',
                    validate(value){
                        if(!value && value !== 0) return false;
                        value = String(value);
                        if(value.length < 1) return false;
                        if(value.length > 150) return false;
                        return true;
                    },
                },
                captchaText:{
                    label:'验证码 : 不能为空 && 长度1-7',
                    validate(value){
                        if(!value && value !== 0) return false;
                        value = String(value);
                        if(value.length < 1) return false;
                        if(value.length > 7) return false;
                        return true;
                    },
                },
            });
            return failData;
        }
        /** 获取验证码 */
        const getCaptcha = throttleFn(function (){
            if(dataContainer.loading_1) return;
            dataContainer.loading_1 = true;
            publicApi.getCaptcha().then(res=>{
                const data = res.data || {};
                dataContainer.captchaId = data.id;
                dataContainer.captchaSvg = data.svg;
                dataContainer.form.captchaText = '';
            }).catch(()=>{
                ElMessage.error('验证码获取失败');
            }).finally(()=>{
                dataContainer.loading_1 = false;
            });
        },700);
        getCaptcha();
        /** 注册操作 */
        const onRegister = throttleFn(function(){
            if(dataContainer.loading) return;
            if (!FormElRef.value) return;
            FormElRef.value.validate((valid,e) => {
                if (!valid){
                    const message = e[Object.keys(e)[0]][0].message;
                    ElMessage.error(message);
                    return;
                };
                const verifiedData_ = validBase(dataContainer.form);
                if(verifiedData_){
                    ElMessage.error('参数错误！'+verifiedData_[0].label);
                    return;
                };
                dataContainer.loading = true;
                const params = enEmojiData({
                    ...dataContainer.form,
                });
                params.captchaId = dataContainer.captchaId;
                userApi.register(params).then(res=>{
                    res = res || {};
                    const data = res.data || {};
                    ElMessage({
                        type: 'success',
                        message: '注册成功',
                    });
                    // 携带注册信息，优化体验
                    window.params = {
                        name:dataContainer.form.name,
                        password:dataContainer.form.password,
                    };
                    router.push({
                        path:'/visitor/login',
                    });
                    dataContainer.form.password = '';
                    dataContainer.form.password_ = '';
                }).catch((res)=>{
                    ElMessage.error('注册失败：'+res.msg);
                }).finally(()=>{
                    dataContainer.loading = false;
                    getCaptcha();
                });
            });
        },700);
        /** 去除首尾空格 */
        function toTrim(data,p){
            let str = data[p];
            str = (str || "").replace(/^\s+|\s+$/g,"");
            data[p] = str;
        }
        /** 去除特殊符号 */
        function palindrome(data,p){
            let str = data[p];
            str = (str || "").replace(/[`:~!#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ~！#￥%……&*（） \+ ={}|《》？：“”【】、；‘’，。、]/g,"");
            data[p] = str;
        }
        return {
            dataContainer,
            onRegister,
            FormElRef,
            getCaptcha,
            toTrim,
            palindrome,
        };
    },
});
</script>

<template>
    <div class="register-view">
        <div class="top-container box-container">
            <el-form
                label-position="top"
                label-width="100px"
                :model="dataContainer.form"
                :rules="dataContainer.rules"
                class="form-container container"
                ref="FormElRef"
            >
                <div class="right">
                    <div class="info-container">
                        <div class="title">
                            欢迎注册毒蘑菇搜索
                        </div>
                        <div class="content">
                            <p>请注意保管好密码，本网站不收集任何个人信息，账号可以是任何字符串。</p>
                            <p>坏处就是密码忘记了不知道怎么找回密码，因为我不认为一个网址是很重要的东西，所以忘记了再注册一个就是了。</p>
                            <p>新注册的账号默认为公开类型，就是说会有个个人网址导航，别人可以访问但是只限访问。可以在个人页面取消公开。</p>
                            <p>🤠 一个账号最多可以添加300个网址，我觉得100个首页就放不到了，本来就是一个极简的导航类型网站，没考虑到会添加很多网址的情况。</p>
                            <p>🥰 网站整体偏向管理风格，才像一个工具，小而美。</p>
                        </div>
                    </div>
                </div>
                <div class="left">
                    <div class="left-container">
                        <el-form-item label="昵称" prop="nickname">
                            <el-input 
                                clearable
                                @keyup.enter="onRegister"
                                v-model="dataContainer.form.nickname" />
                        </el-form-item>
                        <el-form-item label="账号" prop="name">
                            <el-input 
                                clearable
                                @keyup.enter="onRegister"
                                @input="()=>{
                                    toTrim(dataContainer.form,'name');
                                    palindrome(dataContainer.form,'name');
                                }"
                                v-model="dataContainer.form.name" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input 
                                clearable
                                @keyup.enter="onRegister"
                                show-password
                                @input="()=>{
                                    toTrim(dataContainer.form,'password');
                                }"
                                type="password"
                                v-model="dataContainer.form.password" />
                        </el-form-item>
                        <el-form-item label="确认密码" prop="password_">
                            <el-input 
                                clearable
                                @keyup.enter="onRegister"
                                show-password
                                @input="()=>{
                                    toTrim(dataContainer.form,'password_');
                                }"
                                type="password"
                                v-model="dataContainer.form.password_" />
                        </el-form-item>
                        <el-form-item 
                            v-if="dataContainer.form.name=='admin'"
                            label="admin注册暗号" prop="sign">
                            <el-input 
                                clearable
                                @keyup.enter="onRegister"
                                type="password"
                                v-model="dataContainer.form.sign" />
                        </el-form-item>
                        <el-form-item label="验证码" prop="captchaText">
                            <div class="captcha-container">
                                <el-input 
                                    v-model="dataContainer.form.captchaText" 
                                    placeholder=""
                                    @keyup.enter="onRegister"
                                    clearable>
                                </el-input>
                                <div 
                                    class="captcha-right"
                                    @click="getCaptcha"
                                    v-html="dataContainer.captchaSvg">
                                </div>
                            </div>
                        </el-form-item>
                        <div class="bt-list">
                            <el-button
                                class="save-bt"
                                v-if="!dataContainer.form.idU"
                                type="primary"
                                :loading="dataContainer.loading"
                                @click="onRegister">
                                注 册
                                <el-icon
                                    size="20px"
                                    style="margin-left: 15px;"><ArrowRightBold /></el-icon>
                            </el-button>
                        </div>
                        <div class="other">
                            登录管理网址,
                            <router-link to="/visitor/login" class="route-bt">
                                已有账号？去登录
                            </router-link>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
        <SearchContainer></SearchContainer>
    </div>
</template>

<style lang="scss" scoped>
.register-view{
    width: 100%;
    >.top-container{
        padding: 60px 0 80px 0;
        box-sizing: border-box;
        :deep(.form-container){
            .left,.right{
                box-sizing: border-box;
            }
            .left{
                width: 350px;
                >.left-container{
                    box-sizing: border-box;
                    >.bt-list{
                        display: flex;
                        align-items: center;
                        margin: 40px 0;
                        >.save-bt{
                            flex: 1 1 0;
                            width: 0;
                            width: 100px;
                            height: 50px;
                            border: none;
                            font-size: 17px;
                            background-color: #0059B2;
                            background: linear-gradient(to right,#007FFF,#0059B2);
                            box-shadow: 0 3px 3px -2px #00000033, 0 3px 4px 0 #00000024, 0 1px 8px 0 #0000001f;
                        }
                    }
                    >.other{
                        margin-top: 30px;
                        color: #858585;
                        font-size: 16px;
                        >.route-bt{
                            color: #0059B2;
                        }
                    }
                    .captcha-container{
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        >.el-input{
                            flex: 1 1 0;
                            width: 0;
                        }
                        >.captcha-right{
                            width: 150px;
                            height: var(--input-height);
                            background-color: #0059B2;
                            border-radius: 5px;
                            margin-left: 15px;
                            overflow: hidden;
                            cursor: pointer;
                        }
                    }
                }
            }
            .right{
                flex: 1 1 0;
                width: 0;
                margin-right: 60px;
            }
        }
    }
}
</style>

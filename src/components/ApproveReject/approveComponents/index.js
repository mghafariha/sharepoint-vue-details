// @flow
import { mapState, mapActions, mapGetters } from 'vuex'
import Field from './FieldWrapper'

export default {
    template: `
<div class="border">
    <el-row justify='center'>
        <el-col :span="24" class="approve-reject">
            <el-row v-if="access" type='flex' justify='right'>
                <el-col :span="24" class="approve-reject">
                    <el-row justify="end">
                        <el-col v-for='(f, id) in approveFields' :span="12" :key='id'>
                          <div class="approve-field">
                            <div class='master-title'>{{f.Title}}</div>
                            <div class='master-item'>
                                    <Field :fieldId='id'></Field>
                            </div>
                          </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row v-if="access" justify='center'>
                <el-col :span="24" class="approve-comment">
                    <el-row type="flex" justify="center">
                        <el-col :span="8">
                            <el-input v-model="approveRejectComment" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="پیام خود را وارد کنید ..."></el-input>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row v-show="access" justify='center'>
                <el-col :span="24" class="approve-reject">
                    <el-row type='flex' justify="center" class="footer">
                        <el-col :span="2">
                            <el-button type="primary" @click="approveClicked">تایید</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click="rejectClicked">رد</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click="cancelClicked">انصراف</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row v-if="!access" justify='center'>
                <el-col :span="24" class="approve-reject">
                    <el-row type='flex' justify="center" class="footer">
                        <el-col :span="4">
                            <div class="centeralize">
                                <el-button type="primary" @click="cancelClicked">انصراف</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</div>
`,
    components: { Field },
    data(){
        return {
            approveRejectComment : ''
        }
    },
    computed:{
        ...mapState({
            access: s => s.approveRejectAccess,
            listData: s => s.listData,
        }),
        ...mapGetters({
            approveFields: 'filteredApproveFields'
        }),
        listName(){
            return this.listData.EntityTypeName.slice(0, -4)
        },
        redirectURL(){
            return '/Lists/' + this.listName + '/AllItems.aspx'
        }
    },
    methods: {
        ...mapActions(['loadApproveRejectAccess', 'approveForm', 'rejectForm']),
        approveClicked(){
            const h = this.$createElement;
            this.$msgbox({
                title: 'پیام',
                message: h('p', null, [
                    h('div', null, 'فرم با پیام '),
                    h('div', { style: 'color: teal', }, this.approveRejectComment),
                    h('div', null, 'تأیید شود؟'),
                ]),
                showCancelButton: true,
                confirmButtonText: 'بله',
                cancelButtonText: 'خیر',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '...بارگزاری';
                        this.approveForm(this.approveRejectComment).then(() => {
                            done();
                            setTimeout(() => {
                                instance.confirmButtonLoading = false;
                            }, 300);
                        })
                            .catch(() => {
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                                done()
                            })
                    } else {
                        done();
                    }
                }
            })
                .then(() => {
                    this.$message({
                        type: 'success',
                        showClose: true,
                        duration: 0,
                        message: 'عملیات تأیید با موفقیت انجام شد'
                    })
                })
                .then(() => {
                    setTimeout(()=> {
                        location.href = this.redirectURL
                    }, 10)
                })
                .catch(() => {
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        duration: 0,
                        message: 'عملیات تأیید انجام نشد'
                    })
                })
        },
        rejectClicked(){
            if (this.approveRejectComment == '') {
                return this.$message({
                    type: 'warning',
                    showClose: true,
                    duration: 0,
                    message: 'نمی توان بدون پیغام رد کرد!'
                })
            }
            const h = this.$createElement;
            this.$msgbox({
                title: 'پیام',
                message: h('p', null, [
                    h('div', null, 'فرم با پیام '),
                    h('div', { style: 'color: teal', }, this.approveRejectComment),
                    h('div', null, 'رد شود؟'),
                ]),
                showCancelButton: true,
                confirmButtonText: 'بله',
                cancelButtonText: 'خیر',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '...بارگزاری';
                        this.rejectForm(this.approveRejectComment).then(() => {
                            done();
                            setTimeout(() => {
                                instance.confirmButtonLoading = false;
                            }, 300);
                        })
                            .catch(() => {
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                                done()
                            })
                    } else {
                        done();
                    }
                }
            })
                .then(() => {
                    this.$message({
                        type: 'success',
                        showClose: true,
                        duration: 0,
                        message: 'عملیات رد با موفقیت انجام شد'
                    })
                })
                .then(() => {
                    setTimeout(()=> {
                        location.href = this.redirectURL
                    }, 10)
                })
                .catch(() => {
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        duration: 0,
                        message: 'عملیات رد انجام نشد'
                    })
                })
        },
        cancelClicked(){
            setTimeout(()=> {
                location.href = this.redirectURL
            }, 10)
        }
    }
}

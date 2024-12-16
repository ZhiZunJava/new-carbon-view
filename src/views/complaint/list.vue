<template>
  <div class="main">
    <div style="display: flex; justify-content: space-between;align-items: center;">
      <el-breadcrumb separator="/" class="breadcrumb" style="padding: 0 20px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>投诉列表页</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="goButton" @click="handleAdd()">去投诉</el-button>
    </div>

    <div>
      <el-container>
        <el-main v-loading="loading">
          <div class="content">
            <el-table v-loading="loading" :data="complaintList" @row-click="handleTableRow">
              <el-table-column label="序号" type="index" width="55" align="center" />
              <el-table-column label="投诉名称" align="center" prop="title" />
              <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理状态" align="center" prop="status">
                <div slot-scope="scope">
                  <span :style="statusColor(scope.row)">{{ statusFormat(scope.row) }}</span>
                </div>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-edit"
                    v-hasPermi="['bid:complaint:edit']">查看</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize" @pagination="getList" />
          </div>
        </el-main>
      </el-container>
    </div>


    <!-- 添加或修改违规投诉对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="投诉标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入投诉标题" />
        </el-form-item>
        <el-form-item label="投诉信息" prop="content">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactTel">
          <el-input v-model="form.contactTel" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { listComplaint, getComplaint, delComplaint, addComplaint, updateComplaint, exportComplaint } from "../../api/bid/complaint/complaint";
import Editor from '@/components/MyEditor';

export default {
  name: "list",
  components: {
    Editor,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 违规投诉表格数据
      complaintList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 处理状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "投诉标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "投诉信息不能为空", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        contactTel: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("complaint_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    handleTableRow(row, column, event) {
      this.$router.push(`/complaint/detail?id=${row.id}`)
    },
    /** 查询违规投诉列表 */
    getList() {
      this.loading = true;
      listComplaint(this.queryParams).then(response => {
        this.complaintList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 处理状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    statusColor(row, column) {
      if (row.status === '0') {
        return {
          color: '#ffba00'
        }
      }

      return {}
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        enterpriseId: null,
        title: null,
        content: null,
        contact: null,
        contactTel: null,
        status: '0',
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "投诉";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.enterpriseId = this.userId;

          addComplaint(this.form).then(response => {
            this.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
  },
  computed: {
    ...mapGetters(['userId'])
  }
};
</script>

<style lang="scss" scoped>
.content {
  background: #FFFFFF;
  border-radius: 10px;
  opacity: 1;
  min-height: 860px;
  padding: 24px 21px 0 21px;
}

.goButton {
  width: 120px;
  height: 36px;
  border-radius: 4px;
  opacity: 1;
  background: linear-gradient(90deg, #22CDB5 8%, #46DFCA 96%);
  font-family: MicrosoftYaHei, sans-serif;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0em;
  color: #FFFFFF;
}
</style>
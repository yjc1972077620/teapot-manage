import { useState, useEffect } from 'react';
import dsInfoService from '../../services/crud/dsInfo/dsInfoService';
import type { DsInfoPageQuery, DsInfoParam, DsInfoPageVO, DsInfoQuery, DsInfoVO } from '../../types/crud/dsInfo/dsInfoType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTimes, faTrash, faEdit, faSave, faCancel,faSpinner } from '@fortawesome/free-solid-svg-icons';
import AppPagination from '../../components/AppPagination';
import AppNotification, { type NotificationType } from '../../components/AppNotification';
import AppConfigurableForm from '../../components/AppConfigurableForm';
import { FieldConfig, LayoutConfig, FormConfiguration, FieldType } from '../../components/AppConfigurableForm';

type DataSourceItem = {
  id: number;
  name: string;
  host: string;
  port: string;
  database: string;
  userName?: string;
  connectionStatus: 'unknown' | 'connected' | 'disconnected';
  createTime: string;
  lastConnectionTime: string;
  properties?: string;
};

type DataSourceFormData = {
  id?: number | string | null;
  name?: string;
  host?: string;
  port?: string;
  database?: string;
  userName?: string;
  password?: string;
  properties?: string;
};

type TestConnectionState = '' | 'testing' | 'success' | 'error';

function MySQLSourceModule() {
  // 数据源列表
  const [dataSources, setDataSources] = useState<DataSourceItem[]>([]);
  // 筛选条件
  const [filterName, setFilterName] = useState('');
  // 分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9, // 默认展示3排，每排3个卡片
    total: 0
  });
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 测试连接状态，用于存储每个数据源的测试状态
  const [testConnectionStates, setTestConnectionStates] = useState<Record<number, TestConnectionState>>({});

  // 编辑弹窗相关状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentDataSource, setCurrentDataSource] = useState<DataSourceFormData | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false); // 新增: true, 编辑: false

  // 删除确认相关状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteDataSourceId, setDeleteDataSourceId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 通知状态
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: NotificationType;
  }>({
    visible: false,
    message: '',
    type: 'info'
  });

  // 环境配置 - 根据实际环境修改此变量
  // true表示测试环境，false表示生产环境
  const isTestEnvironment = true; // 这里需要根据实际部署环境进行配置

  // 获取默认的用户名和密码
  const getDefaultCredentials = () => {
    if (isTestEnvironment) {
      return {
        userName: 'teapot_sync',
        password: 'Teapot#1405~'
      };
    } else {
      return {
        userName: 'teapot_sync',
        password: '@KLUMLDRR2PMT^'
      };
    }
  };

  // 获取数据源列表
  const fetchDataSources = async () => {
    try {
      setLoading(true);
      // 构造查询参数，MySQL类型为1
      const queryParams: DsInfoPageQuery = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        name: filterName,
        type: 1 // MySQL数据源类型
      };

      const response = await dsInfoService.queryByPage(queryParams);

      // 处理API响应
      if (response.code === 200) {
        // 将DsInfoPageVO转换为组件需要的格式
        const formattedData: DataSourceItem[] = (response.data || []).map((item: DsInfoPageVO) => {
// 从url中解析host和port
          let host = '', port = '';
          if (item.url) {
            const urlMatch = item.url.match(/jdbc:mysql:\/\/([^:]+):(\d+)/);
            if (urlMatch) {
              host = urlMatch[1];
              port = urlMatch[2];
            }
          }

          // 从url或properties中解析database
          let database = '';
          if (item.url) {
            const dbMatch = item.url.match(/database=([^&]+)/);
            if (dbMatch) {
              database = dbMatch[1];
            }
          }

          // 格式化时间显示
          const formatDate = (dateStr) => {
            if (!dateStr) return '未设置';
            const date = new Date(dateStr);
            return date.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
          };

          return {
            id: item.id || 0,
            name: item.name || '',
            host: host,
            port: port,
            database: database,
            // 模拟数据，实际应从API获取
            userName: 'admin',
            connectionStatus: 'unknown', // 默认未知状态，通过测试连接更新
            createTime: formatDate(item.createTime),
            lastConnectionTime: item.updateTime ? formatDate(item.updateTime) : '未连接',
            properties: item.properties
          };
        });

        setDataSources(formattedData);
        setPagination(prev => ({
          ...prev,
          pageSize: response.pageSize || prev.pageSize,
          total: response.total || 0,
          current: response.pageNo || prev.current
        }));
      }
    } catch (error) {
      console.error('获取数据源列表失败:', error);
      showNotification('获取数据源列表失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 处理测试连接
  const handleTestConnection = async (dataSourceId) => {
    try {
      // 更新测试状态为测试中
      setTestConnectionStates(prev => ({
        ...prev,
        [dataSourceId]: 'testing'
      }));

      // 构造测试连接参数
      const params: DsInfoQuery = { id: dataSourceId };

      // 调用connectCheck接口
      const response = await dsInfoService.connectCheck(params);

      // 获取当前时间并格式化
      const currentTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // 更新测试状态和连接状态
      if (response.code === 200 && response.data) {
        setTestConnectionStates(prev => ({
          ...prev,
          [dataSourceId]: 'success'
        }));

        // 更新数据源的连接状态和上次连接时间
        setDataSources(prev => prev.map(item =>
          item.id === dataSourceId
            ? { ...item, connectionStatus: 'connected', lastConnectionTime: currentTime }
            : item
        ));

        // 3秒后清除成功状态显示
        setTimeout(() => {
          setTestConnectionStates(prev => ({
            ...prev,
            [dataSourceId]: ''
          }));
        }, 3000);
      } else {
        setTestConnectionStates(prev => ({
          ...prev,
          [dataSourceId]: 'error'
        }));

        // 更新数据源的连接状态
        setDataSources(prev => prev.map(item =>
          item.id === dataSourceId
            ? { ...item, connectionStatus: 'disconnected' }
            : item
        ));

        // 3秒后清除错误状态显示
        setTimeout(() => {
          setTestConnectionStates(prev => ({
            ...prev,
            [dataSourceId]: ''
          }));
        }, 3000);
      }
    } catch (error) {
      console.error('测试连接失败:', error);
      setTestConnectionStates(prev => ({
        ...prev,
        [dataSourceId]: 'error'
      }));

      // 更新数据源的连接状态
      setDataSources(prev => prev.map(item =>
        item.id === dataSourceId
          ? { ...item, connectionStatus: 'disconnected' }
          : item
      ));

      // 3秒后清除错误状态显示
      setTimeout(() => {
        setTestConnectionStates(prev => ({
          ...prev,
          [dataSourceId]: ''
        }));
      }, 3000);
    }
  };

  // 处理分页变化
  const handlePageChange = (newPage, newPageSize = pagination.pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: newPage,
      pageSize: newPageSize
    }));
  };

  // 处理筛选
  const handleFilter = () => {
    setPagination(prev => ({
      ...prev,
      current: 1 // 重置为第一页
    }));
  };

  // 处理筛选输入框回车
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  // 获取连接状态对应的样式和文本
  const getStatusInfo = (status, testState) => {
    if (testState === 'testing') {
      return { class: 'bg-yellow-100 text-yellow-800', text: '测试中...' };
    } else if (testState === 'success') {
      return { class: 'bg-green-100 text-green-800', text: '连接成功' };
    } else if (testState === 'error') {
      return { class: 'bg-red-100 text-red-800', text: '连接失败' };
    } else if (status === 'connected') {
      return { class: 'bg-green-100 text-green-800', text: '已连接' };
    } else if (status === 'disconnected') {
      return { class: 'bg-red-100 text-red-800', text: '未连接' };
    } else {
      return { class: 'bg-gray-100 text-gray-800', text: '未知状态' };
    }
  };

  // 显示通知
  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({
      visible: true,
      message,
      type
    });
  };

  // 关闭通知
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  // 打开编辑弹窗
  const handleEditClick = async (dataSourceId) => {
    try {
      setFormLoading(true);
      // 调用查询详情接口
      const queryParams: DsInfoQuery = { id: dataSourceId };
      const response = await dsInfoService.queryById(queryParams);

      if (response.code === 200 && response.data) {
        const dataSource: DsInfoVO = response.data;
        setIsAddMode(false);
        // 解析URL信息用于表单显示
        let host = '', port = '', database = '';
        if (dataSource.url) {
          const urlMatch = dataSource.url.match(/jdbc:mysql:\/\/([^:]+):(\d+)/);
          if (urlMatch) {
            host = urlMatch[1];
            port = urlMatch[2];
          }

          // 修改数据库名解析逻辑，优先从URL路径部分解析，与保存时的格式保持一致
          // 匹配host:port/后的数据库名部分，直到问号或结束
          const pathDbMatch = dataSource.url.match(/jdbc:mysql:\/\/[^:]+:\d+\/([^?]+)/);
          if (pathDbMatch) {
            database = pathDbMatch[1];
          } else {
            // 保留原有的参数解析方式作为后备方案
            const paramDbMatch = dataSource.url.match(/database=([^&]+)/);
            if (paramDbMatch) {
              database = paramDbMatch[1];
            }
          }
        }

        // 获取默认凭据
        const defaultCredentials = getDefaultCredentials();

        // 设置表单数据 - 使用默认的用户名和密码
        setCurrentDataSource({
          id: dataSource.id,
          name: dataSource.name,
          host,
          port,
          database,
          userName: defaultCredentials.userName, // 固定使用默认用户名
          password: defaultCredentials.password, // 固定使用默认密码
          properties: dataSource.properties || ''
        });

        // 显示编辑弹窗
        setEditModalVisible(true);
      } else {
        showNotification('获取数据源详情失败', 'error');
      }
    } catch (error) {
      console.error('获取数据源详情失败:', error);
      showNotification('获取数据源详情失败', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // 打开新增弹窗
  const handleAddClick = () => {
    setCurrentDataSource(null);
    setIsAddMode(true);

    // 获取默认凭据
    const defaultCredentials = getDefaultCredentials();

    // 设置表单数据 - 使用默认的用户名和密码
    setCurrentDataSource({
      id: '',
      name: '',
      host: '',
      port: '3306', // 默认MySQL端口
      database: '',
      userName: defaultCredentials.userName, // 固定使用默认用户名
      password: defaultCredentials.password, // 固定使用默认密码
      properties: '{}'
    });
    // 显示弹窗
    setEditModalVisible(true);
  };

  // 关闭编辑弹窗
  const handleEditClose = () => {
    setEditModalVisible(false);
    setCurrentDataSource(null);
  };

  // AppConfigurableForm 使用的提交处理函数
  const handleFormSubmit = async (e, formData) => {
    try {
      // 处理可能的参数顺序问题
      let actualFormData = formData;
      if (e && typeof e === 'object' && !e.preventDefault) {
        // 如果第一个参数看起来是数据对象而不是事件对象
        actualFormData = e;
      }
      
      console.log('提交的表单数据:', actualFormData);
      
      if (!actualFormData || Object.keys(actualFormData).length === 0) {
        console.error('没有接收到表单数据！');
        showNotification('表单数据为空，请重新填写', 'error');
        return;
      }
      
      setFormLoading(true);
  
      // 获取默认凭据
      const defaultCredentials = getDefaultCredentials();
  
      // 构造JDBC URL
      const jdbcUrl = `jdbc:mysql://${actualFormData.host}:${actualFormData.port}/${actualFormData.database}?useUnicode=true&characterEncoding=utf-8&useSSL=false&zeroDateTimeBehavior=convertToNull`;
  
      // 构造参数 - 使用默认的用户名和密码
      const params: DsInfoParam = {
        id: isAddMode ? undefined : Number(actualFormData.id),
        name: actualFormData.name,
        url: jdbcUrl,
        userName: defaultCredentials.userName, // 直接使用默认用户名
        password: defaultCredentials.password, // 直接使用默认密码
        properties: actualFormData.properties,
        type: 1 // MySQL类型
      };
  
      // 根据模式调用不同的API
      const response = isAddMode
        ? await dsInfoService.insert(params)
        : await dsInfoService.update(params);

      if (response.code === 200 && response.data) {
        showNotification(isAddMode ? '数据源添加成功' : '数据源更新成功', 'success');
        // 关闭弹窗
        handleEditClose();
        // 重新加载数据
        fetchDataSources();
      } else {
        showNotification(isAddMode ? '数据源添加失败' : '数据源更新失败', 'error');
      }
    } catch (error) {
      console.error('保存数据源失败:', error);
      showNotification(isAddMode ? '数据源添加失败' : '数据源更新失败', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // 打开删除确认
  const handleDeleteClick = (dataSourceId) => {
    setDeleteDataSourceId(dataSourceId);
    setDeleteConfirmVisible(true);
  };

  // 关闭删除确认
  const handleDeleteClose = () => {
    setDeleteConfirmVisible(false);
    setDeleteDataSourceId(null);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    try {
      if (!deleteDataSourceId) return;

      setDeleteLoading(true);

      // 构造删除参数
      const deleteParams = {
        id: deleteDataSourceId
      };

      // 调用删除接口
      const response = await dsInfoService.delete(deleteParams);

      if (response.code === 200 && response.data) {
        showNotification('数据源删除成功', 'success');
        // 关闭确认弹窗
        handleDeleteClose();
        // 重新加载数据
        fetchDataSources();
      } else {
        showNotification('数据源删除失败', 'error');
      }
    } catch (error) {
      console.error('删除数据源失败:', error);
      showNotification('删除数据源失败', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // 初始加载和分页/筛选变化时重新加载数据
  useEffect(() => {
    fetchDataSources();
  }, [pagination.current, pagination.pageSize, filterName]);

  // 表单字段配置 - 使用FieldConfig类
  const formFieldConfigs = [
    new FieldConfig({
      name: 'name',
      label: '数据源名称',
      type: FieldType.TEXT,
      placeholder: '请输入数据源名称',
      required: true
    }),
    new FieldConfig({
      name: 'host',
      label: '主机地址',
      type: FieldType.TEXT,
      placeholder: '请输入主机地址',
      required: true
    }),
    new FieldConfig({
      name: 'port',
      label: '端口',
      type: FieldType.TEXT,
      placeholder: '请输入端口',
      required: true,
      defaultValue: '3306'
    }),
    new FieldConfig({
      name: 'database',
      label: '数据库名',
      type: FieldType.TEXT,
      placeholder: '请输入数据库名',
      required: true
    }),
    new FieldConfig({
      name: 'userName',
      label: '用户名',
      type: FieldType.TEXT,
      placeholder: '请输入用户名',
      disabled: true,
      tips: '默认用户名，不可修改'
    }),
    new FieldConfig({
      name: 'password',
      label: isAddMode ? '密码 *' : '密码 (留空表示不修改)',
      type: FieldType.PASSWORD,
      placeholder: isAddMode ? '请输入密码' : '请输入密码，留空表示不修改',
      disabled: true,
      tips: '默认密码，点击可查看'
    }),
    new FieldConfig({
      name: 'properties',
      label: '额外属性',
      type: FieldType.TEXTAREA,
      placeholder: '请输入额外属性，JSON格式',
      defaultValue: '{}',
      componentProps: { rows: 4 }
    })
  ];

  // 创建表单配置实例
  const formConfiguration = new FormConfiguration()
    .addFields(formFieldConfigs)
    .setLayout({ fieldsPerRow: 2 })
    .setInitialData(currentDataSource || {})
    .setSubmitConfig({
      text: formLoading ? (
        <span className="flex items-center">
          <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
          处理中...
        </span>
      ) : (
        <span className="flex items-center">
          <FontAwesomeIcon icon={faSave} className="mr-1" /> {isAddMode ? '添加' : '保存'}
        </span>
      ),
      onClick: handleFormSubmit,
      show: true
    })
    .setCancelConfig({
      text: (
        <span className="flex items-center">
          <FontAwesomeIcon icon={faCancel} className="mr-1" /> {'取消'}
        </span>
      ),
      onClick: handleEditClose,
      show: true
    })
    .setLoading(formLoading);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">MySQL数据源管理</h1>

        {/* 搜索和添加按钮区域 */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <input
              type="text"
              placeholder="按名称搜索..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            onClick={handleAddClick}
          >
            添加数据源
          </button>
        </div>
      </div>

      {/* 数据源卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {loading ? (
          // 加载状态
          Array.from({ length: pagination.pageSize }).map((_, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex justify-end gap-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))
        ) : dataSources.length > 0 ? (
          // 数据源卡片
          dataSources.map((source) => {
            const statusInfo = getStatusInfo(source.connectionStatus, testConnectionStates[source.id]);
            return (
              <div key={source.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{source.name}</h3>
                    <p className="text-sm text-gray-500">{source.database} @ {source.host}:{source.port}</p>
                  </div>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.class}`}>
                    {statusInfo.text}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-600 w-20">创建时间:</span>
                    <span className="text-sm text-gray-800">{source.createTime}</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-600 w-20">上次连接:</span>
                    <span className="text-sm text-gray-800">{source.lastConnectionTime}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditClick(source.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" /> 编辑
                  </button>
                  <button
                    onClick={() => handleDeleteClick(source.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" /> 删除
                  </button>
                  <button
                    onClick={() => handleTestConnection(source.id)}
                    disabled={testConnectionStates[source.id] === 'testing'}
                    className={`${testConnectionStates[source.id] === 'testing' ? 'bg-yellow-500' : 'bg-purple-600'} text-white px-3 py-1 rounded hover:bg-opacity-90 transition-colors text-sm ${testConnectionStates[source.id] === 'testing' ? 'cursor-not-allowed' : ''}`}
                  >
                    {testConnectionStates[source.id] === 'testing' ? '测试中...' : '测试链接'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          // 空状态
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FontAwesomeIcon icon={faSearch} className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">未找到数据源</h3>
            <p className="text-gray-500">没有符合条件的MySQL数据源，请尝试调整筛选条件或添加新的数据源。</p>
          </div>
        )}
      </div>

      {/* 分页控件 */}
      <AppPagination
        totalItems={pagination.total}
        currentPage={pagination.current}
        defaultPageSize={pagination.pageSize}
        pageSizeOptions={[6, 9, 12]}
        onPageChange={handlePageChange}
        showSizeChanger={true}
        showTotal={true}
        maxVisiblePages={5}
        prevText={<FontAwesomeIcon icon={faChevronLeft} />}
        nextText={<FontAwesomeIcon icon={faChevronRight} />}
      />

      {/* 编辑/新增数据源弹窗 */}
      {editModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleEditClose}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">{isAddMode ? '新增MySQL数据源' : '编辑MySQL数据源'}</h3>
              <button
                onClick={handleEditClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {formLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">加载中...</p>
              </div>
            ) : (
              <div className="p-6">
                <AppConfigurableForm
                  formConfiguration={formConfiguration}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {deleteConfirmVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleDeleteClose}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FontAwesomeIcon icon={faTrash} className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">确认删除</h3>
                <p className="mt-2 text-sm text-gray-500">
                  您确定要删除这个MySQL数据源吗？此操作不可撤销。
                </p>
              </div>
              <div className="mt-6 flex justify-center space-x-3">
                <button
                  onClick={handleDeleteClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {deleteLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      删除中...
                    </span>
                  ) : (
                    '确认删除'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 通知组件 */}
      <AppNotification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={closeNotification}
      />
    </div>
  );
}

export default MySQLSourceModule;

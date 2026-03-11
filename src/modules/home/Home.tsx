import { Card, Col, Row, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Card bordered={false} className="shadow-sm">
        <Title level={2} className="!mb-2">Teapot Manager</Title>
        <Paragraph className="text-gray-600">
          统一管理同步实例、数据源、日志与任务执行状态，提供全流程可视化控制与审计。
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={8}>
          <Card bordered={false} className="shadow-sm h-full">
            <Title level={4}>同步实例管理</Title>
            <Paragraph className="text-gray-600">
              管理 ES / ClickHouse / Doris / 本地部署的同步实例，支持启停、全量同步与日志开关。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Card bordered={false} className="shadow-sm h-full">
            <Title level={4}>日志与实时控制台</Title>
            <Paragraph className="text-gray-600">
              查看同步结果、进度与控制台输出，定位失败原因与数据问题。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Card bordered={false} className="shadow-sm h-full">
            <Title level={4}>数据源与配置</Title>
            <Paragraph className="text-gray-600">
              统一维护 MySQL 数据源、映射规则与配置项，保证数据同步稳定可控。
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm">
        <Title level={4}>快速入口</Title>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={8}>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <div className="text-sm text-gray-500">多类型同步管理</div>
              <div className="text-lg font-semibold text-gray-900">ES / ClickHouse / Doris / 本地部署</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <div className="text-sm text-gray-500">日志管理</div>
              <div className="text-lg font-semibold text-gray-900">审计与实时监控</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <div className="text-sm text-gray-500">数据源管理</div>
              <div className="text-lg font-semibold text-gray-900">连接与配置维护</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home;

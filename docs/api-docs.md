# Teapot Swagger API Extract

This document is generated from `docs/api/*.json` to capture endpoint definitions and full request/response schemas.

## clickhouse.json
- title: clickhouse类型映射关系
- description: clickhouse类型映射关系
- host: cloud.rj-info.com
- basePath: /teapot
- schemes: http

### Endpoints

#### POST /teapot/clickhouse/columnItem/delete
- summary: 删除列映射信息
- operationId: deleteColumnItem
- tags: clickhouse类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.param.IdsParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/clickhouse/columnItem/insert
- summary: 批量新增列映射信息
- operationId: insertColumnItem
- tags: clickhouse类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.clickhouse.controller.request.ClickhouseColumnItemRequest
  - columnItemList: array<ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemParam>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 所属表id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>
      - createTime: string (date) - 创建时间
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### POST /teapot/clickhouse/columnItem/mappingAll
- summary: 获取mappingAll列映射信息
- operationId: getMappingAllColumnItem
- tags: clickhouse类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.param.MappingColumnParam
  - dsInfoId: integer (int64-object) - 数据源id
  - tableName: string - 表名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - msg: string - 异常结果返回值

#### POST /teapot/clickhouse/columnItem/update
- summary: 批量更新列映射信息
- operationId: updateColumnItem
- tags: clickhouse类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.clickhouse.controller.request.ClickhouseColumnItemUpdateRequest
  - columnItemList: array<ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemUpdateParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemUpdateParam>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/clickhouse/tableItem/delete
- summary: 批量删除表结构信息
- operationId: deleteTableItem
- tags: clickhouse类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.param.IdsParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/clickhouse/tableItem/insert
- summary: 批量新增表结构信息
- operationId: insertTableItem
- tags: clickhouse类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.clickhouse.controller.request.ClickhouseTableItemRequest
  - instanceId: integer (int64-object) - 所属实例id
  - mappingId: integer (int64-object) - 所属映射关系id
  - tableItemList: array<ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemParam>
      - clickhouseDbName: string - clickhouse数据库名
      - clickhouseTableName: string - clickhouse表名
      - dbName: string - dbName
      - master: boolean (boolean-object) - 是否主表
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseTableItem
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseTableItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseTableItem>
      - clickhouseDbName: string - clickhouse数据库名
      - clickhouseTableName: string - clickhouse表名
      - columnItemList: array<ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>> - 表字段映射关系
        - items: ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>
          - createTime: string (date) - 创建时间
          - foreignKey: boolean (boolean-object) - 是否为主表外键
          - id: integer (int64-object) - id
          - mainTableFk: string - 子表对应主表外键列名
          - needData: boolean (boolean-object) - 是否需要该数据
          - primaryKey: boolean (boolean-object) - 是否为主键
          - srcColumnName: string - 源表字段名
          - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 该列所属表映射信息id
          - targetColumnName: string - 映射到目标字段名
          - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - updateTime: string (date) - 更新时间
      - createTime: string (date) - 创建时间
      - dbName: string - dbName
      - id: integer (int64-object) - id
      - instanceId: integer (int64-object) - id
      - mappingId: integer (int64-object) - 表映射对应的mapping信息id
      - master: boolean (boolean-object) - 是否主表
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取库名_表名)
      - updateTime: string (date) - 更新时间
      - updateTimeColumnName: string - 标识更新时间的字段名
  - msg: string - 异常结果返回值

#### POST /teapot/clickhouse/tableItem/update
- summary: 更新表结构信息
- operationId: updateTableItem
- tags: clickhouse类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.clickhouse.controller.request.ClickhouseTableItemUpdateRequest
  - tableItemList: array<ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemUpdateParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemUpdateParam>
      - clickhouseDbName: string - clickhouse数据库名
      - clickhouseTableName: string - clickhouse表名
      - dbName: string - dbName
      - id: integer (int64-object) - id
      - master: boolean (boolean-object) - 是否主表
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

### Schemas

#### com.ruijing.fundamental.api.remote.RemoteResponse
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: object - 返回结果数据
    - (value): object - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>
      - createTime: string (date) - 创建时间
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseTableItem
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseTableItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseTableItem>
      - clickhouseDbName: string - clickhouse数据库名
      - clickhouseTableName: string - clickhouse表名
      - columnItemList: array<ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>> - 表字段映射关系
        - items: ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>
          - createTime: string (date) - 创建时间
          - foreignKey: boolean (boolean-object) - 是否为主表外键
          - id: integer (int64-object) - id
          - mainTableFk: string - 子表对应主表外键列名
          - needData: boolean (boolean-object) - 是否需要该数据
          - primaryKey: boolean (boolean-object) - 是否为主键
          - srcColumnName: string - 源表字段名
          - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 该列所属表映射信息id
          - targetColumnName: string - 映射到目标字段名
          - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - updateTime: string (date) - 更新时间
      - createTime: string (date) - 创建时间
      - dbName: string - dbName
      - id: integer (int64-object) - id
      - instanceId: integer (int64-object) - id
      - mappingId: integer (int64-object) - 表映射对应的mapping信息id
      - master: boolean (boolean-object) - 是否主表
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取库名_表名)
      - updateTime: string (date) - 更新时间
      - updateTimeColumnName: string - 标识更新时间的字段名
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - msg: string - 异常结果返回值

#### com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemParam
- structure:
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemUpdateParam
- structure:
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - id: integer (int64-object) - id
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemParam
- structure:
  - clickhouseDbName: string - clickhouse数据库名
  - clickhouseTableName: string - clickhouse表名
  - dbName: string - dbName
  - master: boolean (boolean-object) - 是否主表
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - shardedCount: integer (int32-object) - 水平分表的分片数
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - tableNameRegex: string - 表名正则（表被水平拆分时）
  - topic: string - 表对应的topic(topic未指定默认取表名)
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemUpdateParam
- structure:
  - clickhouseDbName: string - clickhouse数据库名
  - clickhouseTableName: string - clickhouse表名
  - dbName: string - dbName
  - id: integer (int64-object) - id
  - master: boolean (boolean-object) - 是否主表
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - shardedCount: integer (int32-object) - 水平分表的分片数
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - tableNameRegex: string - 表名正则（表被水平拆分时）
  - topic: string - 表对应的topic(topic未指定默认取表名)
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.clickhouse.controller.request.ClickhouseColumnItemRequest
- structure:
  - columnItemList: array<ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemParam>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 所属表id

#### com.ruijing.sync.adapter.clickhouse.controller.request.ClickhouseColumnItemUpdateRequest
- structure:
  - columnItemList: array<ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemUpdateParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseColumnItemUpdateParam>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.clickhouse.controller.request.ClickhouseTableItemRequest
- structure:
  - instanceId: integer (int64-object) - 所属实例id
  - mappingId: integer (int64-object) - 所属映射关系id
  - tableItemList: array<ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemParam>
      - clickhouseDbName: string - clickhouse数据库名
      - clickhouseTableName: string - clickhouse表名
      - dbName: string - dbName
      - master: boolean (boolean-object) - 是否主表
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.clickhouse.controller.request.ClickhouseTableItemUpdateRequest
- structure:
  - tableItemList: array<ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemUpdateParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.clickhouse.controller.param.ClickhouseTableItemUpdateParam>
      - clickhouseDbName: string - clickhouse数据库名
      - clickhouseTableName: string - clickhouse表名
      - dbName: string - dbName
      - id: integer (int64-object) - id
      - master: boolean (boolean-object) - 是否主表
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem
- structure:
  - createTime: string (date) - 创建时间
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - id: integer (int64-object) - id
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 该列所属表映射信息id
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - updateTime: string (date) - 更新时间

#### com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseTableItem
- structure:
  - clickhouseDbName: string - clickhouse数据库名
  - clickhouseTableName: string - clickhouse表名
  - columnItemList: array<ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>> - 表字段映射关系
    - items: ref<com.ruijing.sync.adapter.clickhouse.mapping.entity.ClickhouseColumnItem>
      - createTime: string (date) - 创建时间
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - createTime: string (date) - 创建时间
  - dbName: string - dbName
  - id: integer (int64-object) - id
  - instanceId: integer (int64-object) - id
  - mappingId: integer (int64-object) - 表映射对应的mapping信息id
  - master: boolean (boolean-object) - 是否主表
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - shardedCount: integer (int32-object) - 水平分表的分片数
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - tableNameRegex: string - 表名正则（表被水平拆分时）
  - topic: string - 表对应的topic(topic未指定默认取库名_表名)
  - updateTime: string (date) - 更新时间
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
- structure:
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.common.param.IdsParam
- structure:
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

#### com.ruijing.sync.common.param.MappingColumnParam
- structure:
  - dsInfoId: integer (int64-object) - 数据源id
  - tableName: string - 表名

## crud.json
- title: msharp_teapot_crud
- version: 1.0.0
- description: msharp_teapot_crud
- host: cloud.rj-info.com
- basePath: /teapot
- schemes: http

### Endpoints

#### POST /teapot/dsInfo/connectCheck
- summary: 数据源连通性校验
- operationId: connectCheck
- tags: 数据源信息表DsInfo管理

##### Request
- query (body), required: False
  - schema: com.ruijing.sync.common.query.DsInfoQuery
  - id: integer (int64-object) - id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/dsInfo/delete
- summary: 删除DsInfo
- operationId: delete
- tags: 数据源信息表DsInfo管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.DeleteParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/dsInfo/getDsInfo
- summary: id 查询DsInfo
- operationId: detail
- tags: 数据源信息表DsInfo管理

##### Request
- query (body), required: False
  - schema: com.ruijing.sync.common.query.DsInfoQuery
  - id: integer (int64-object) - id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.DsInfoVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.DsInfoVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - id: integer (int64-object) - id
    - name: string - 数据源名
    - password: string - 密码
    - properties: string - 额外信息
    - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
    - updateTime: string (date) - 更新时间
    - url: string - 数据源连接url
    - userName: string - 用户名
  - msg: string - 异常结果返回值

#### POST /teapot/dsInfo/insert
- summary: 新增DsInfo
- operationId: insert
- tags: 数据源信息表DsInfo管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.DsInfoParam
  - id: integer (int64-object) - id
  - name: string - 数据源名
  - password: string - 密码
  - properties: object - 额外信息
    - (value): object - 额外信息
  - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
  - url: string - 数据源连接url
  - userName: string - 用户名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.DsInfoVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.DsInfoVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - id: integer (int64-object) - id
    - name: string - 数据源名
    - password: string - 密码
    - properties: string - 额外信息
    - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
    - updateTime: string (date) - 更新时间
    - url: string - 数据源连接url
    - userName: string - 用户名
  - msg: string - 异常结果返回值

#### POST /teapot/dsInfo/page
- summary: DsInfo 分页查询
- operationId: queryByPage
- tags: 数据源信息表DsInfo管理

##### Request
- pageQuery (body), required: False
  - schema: com.ruijing.sync.common.query.DsInfoPageQuery
  - createTimeEnd: string (date) - 创建时间止
  - createTimeStart: string (date) - 创建时间起
  - idList: array<integer (int64-object)> - idList
    - items: integer (int64-object)
  - name: string - 数据源名
  - pageNo: integer (int32-object)
  - pageSize: integer (int32-object)
  - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.PageableResponsejava.util.Listcom.ruijing.sync.common.vo.DsInfoPageVO
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.DsInfoPageVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.DsInfoPageVO>
      - createTime: string (date) - 创建时间
      - id: integer (int64-object) - id
      - name: string - 数据源名
      - properties: string - 额外信息
      - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
      - updateTime: string (date) - 更新时间
      - url: string - 数据源连接url
  - msg: string - 异常结果返回值
  - pageNo: integer (int32)
  - pageSize: integer (int32)

#### POST /teapot/dsInfo/queryById
- summary: 查询数据源信息
- operationId: queryById
- tags: 数据源信息表DsInfo管理

##### Request
- query (body), required: False
  - schema: com.ruijing.sync.common.query.DsInfoQuery
  - id: integer (int64-object) - id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.DsInfoVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.DsInfoVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - id: integer (int64-object) - id
    - name: string - 数据源名
    - password: string - 密码
    - properties: string - 额外信息
    - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
    - updateTime: string (date) - 更新时间
    - url: string - 数据源连接url
    - userName: string - 用户名
  - msg: string - 异常结果返回值

#### POST /teapot/dsInfo/tableNames
- summary: 查询数据源下所有表
- operationId: queryTablesByDsId
- tags: 数据源信息表DsInfo管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.IdsParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listjava.lang.String
  - code: integer (int32) - 结果返回状态码
  - data: array<string> - 返回结果数据
    - items: string
  - msg: string - 异常结果返回值

#### POST /teapot/dsInfo/update
- summary: 更新DsInfo
- operationId: update
- tags: 数据源信息表DsInfo管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.DsInfoParam
  - id: integer (int64-object) - id
  - name: string - 数据源名
  - password: string - 密码
  - properties: object - 额外信息
    - (value): object - 额外信息
  - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
  - url: string - 数据源连接url
  - userName: string - 用户名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/etlSyncLog/delete
- summary: 删除EtlSyncLog
- operationId: delete
- tags: 全量同步日志EtlSyncLog管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.DeleteParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/etlSyncLog/getEtlSyncLog
- summary: id 查询EtlSyncLog
- operationId: queryById
- tags: 全量同步日志EtlSyncLog管理

##### Request
- query (body), required: False
  - schema: com.ruijing.sync.common.query.EtlSyncLogQuery
  - id: integer (int64-object) - id
  - logType: integer (int32-object) - 日志类型 1全量同步日志 2 补偿同步日志 3 断点续传日志
  - syncInstanceId: integer (int64-object) - 同步实例id
  - syncInstanceName: string - 同步实例名
  - syncResult: integer (int32-object) - 同步结果 1 成功 2 失败
  - syncType: integer (int32-object) - 同步类型 1 mysql 2 es
  - topic: string - mq的topic

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.EtlSyncLogVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.EtlSyncLogVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - errorMsg: string - 失败原因
    - failCount: integer (int64-object) - 失败条数
    - id: integer (int64-object) - id
    - logType: integer (int32-object) - 日志类型 0全量同步日志 1 补偿同步日志 2 断点续传日志
    - operateUserId: integer (int64-object) - 操作人id
    - relateLog: ref<com.ruijing.sync.common.vo.EtlSyncLogVO> - 补偿日志的关联日志
      - (circular ref: com.ruijing.sync.common.vo.EtlSyncLogVO)
    - snapshotId: string
    - snapshotJson: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>
      - failCount: integer (int64-object) - 失败条数
      - filterCnt: integer (int64-object) - 过滤条数
      - instanceId: integer (int64-object) - 实例id
      - instanceName: string - 实例名
      - orgId: integer (int32-object) - 单位id（本地部署）
      - sharded: boolean (boolean-object) - 是否为水平分表
      - snapshotId: string - 快照id
      - successCount: integer (int64-object) - 成功条数
      - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
      - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
          - curBatch: integer (int64-object) - 当前同步批次
          - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - failCount: integer (int64-object) - 失败条数
          - filterCnt: integer (int64-object) - 过滤条数
          - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - successCount: integer (int64-object) - 成功条数
          - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
          - tableDataCount: integer (int64-object) - 当前表总数据量
          - tableName: string - 表名
          - totalBatchCount: integer (int64-object) - 同步总批次
      - totalCount: integer (int64-object) - 同步总条数
    - srcDsInfo: string - 源端信息（库-表）
    - successCount: integer (int64-object) - 成功条数
    - syncEndTime: string (date) - 同步结束时间
    - syncInstanceId: integer (int64-object) - 同步实例id
    - syncInstanceName: string - 同步实例名
    - syncResult: string - 同步结果 1 成功 2 失败
    - syncStartTime: string (date) - 同步开始时间
    - syncType: string - 同步类型 1 mysql 2 es
    - targetDsInfo: string - 目标端数据源信息（库-表 or 索引）
    - timeConsuming: integer (int64-object) - 同步总耗时
    - topic: string - mq的topic
    - totalCount: integer (int64-object) - 同步总条数
    - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### POST /teapot/etlSyncLog/insert
- summary: 新增EtlSyncLog
- operationId: insert
- tags: 全量同步日志EtlSyncLog管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.EtlSyncLogParam
  - createTime: string (date) - 创建时间
  - errorMsg: string - 失败原因
  - failCount: integer (int64-object) - 失败条数
  - id: integer (int64-object) - id
  - logType: integer (int32-object) - 日志类型 1全量同步日志 2 补偿同步日志 3 断点续传日志
  - operateUserId: integer (int64-object) - 操作人id
  - relateLog: integer (int64-object) - 补偿日志的关联日志id
  - srcDsInfo: string - 源端信息（库-表）
  - successCount: integer (int64-object) - 成功条数
  - syncEndTime: string (date) - 同步结束时间
  - syncInstanceId: integer (int64-object) - 同步实例id
  - syncInstanceName: string - 同步实例名
  - syncResult: integer (int32-object) - 同步结果 1 成功 2 失败
  - syncStartTime: string (date) - 同步开始时间
  - syncType: integer (int32-object) - 同步类型 1 mysql 2 es
  - targetDsInfo: string - 目标端数据源信息（库-表 or 索引）
  - timeConsuming: integer (int64-object) - 同步总耗时
  - topic: string - mq的topic
  - totalCount: integer (int64-object) - 同步总条数
  - updateTime: string (date) - 更新时间

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/etlSyncLog/page
- summary: EtlSyncLog 分页查询
- operationId: queryByPage
- tags: 全量同步日志EtlSyncLog管理

##### Request
- pageQuery (body), required: False
  - schema: com.ruijing.sync.common.query.EtlSyncLogPageQuery
  - createTimeEnd: string (date) - 创建时间止
  - createTimeStart: string (date) - 创建时间起
  - id: integer (int64-object) - id
  - logTypeList: array<integer (int32-object)> - 日志类型 1 mysql 2 es
    - items: integer (int32-object)
  - pageNo: integer (int32-object)
  - pageSize: integer (int32-object)
  - snapshotIdList: array<string> - 同步快照id数组
    - items: string
  - syncInstanceId: integer (int64-object) - 同步实例id
  - syncInstanceName: string - 同步实例名
  - syncResult: integer (int32-object) - 同步结果 1 成功 2 失败
  - syncType: integer (int32-object) - 同步类型 1 mysql 2 es

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.PageableResponsejava.util.Listcom.ruijing.sync.common.vo.EtlSyncLogVO
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EtlSyncLogVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EtlSyncLogVO>
      - createTime: string (date) - 创建时间
      - errorMsg: string - 失败原因
      - failCount: integer (int64-object) - 失败条数
      - id: integer (int64-object) - id
      - logType: integer (int32-object) - 日志类型 0全量同步日志 1 补偿同步日志 2 断点续传日志
      - operateUserId: integer (int64-object) - 操作人id
      - relateLog: ref<com.ruijing.sync.common.vo.EtlSyncLogVO> - 补偿日志的关联日志
        - (circular ref: com.ruijing.sync.common.vo.EtlSyncLogVO)
      - snapshotId: string
      - snapshotJson: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>
        - failCount: integer (int64-object) - 失败条数
        - filterCnt: integer (int64-object) - 过滤条数
        - instanceId: integer (int64-object) - 实例id
        - instanceName: string - 实例名
        - orgId: integer (int32-object) - 单位id（本地部署）
        - sharded: boolean (boolean-object) - 是否为水平分表
        - snapshotId: string - 快照id
        - successCount: integer (int64-object) - 成功条数
        - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
        - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
          - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
            - curBatch: integer (int64-object) - 当前同步批次
            - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
              - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
                - batchId: integer (int64-object) - 批次id
                - batchSize: integer (int64-object) - 当前批次同步数量
                - maxDataId: integer (int64-object) - 当前批次最大id
                - minDataId: integer (int64-object) - 当前批次起始id
            - failCount: integer (int64-object) - 失败条数
            - filterCnt: integer (int64-object) - 过滤条数
            - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
              - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
                - batchId: integer (int64-object) - 批次id
                - batchSize: integer (int64-object) - 当前批次同步数量
                - maxDataId: integer (int64-object) - 当前批次最大id
                - minDataId: integer (int64-object) - 当前批次起始id
            - successCount: integer (int64-object) - 成功条数
            - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
            - tableDataCount: integer (int64-object) - 当前表总数据量
            - tableName: string - 表名
            - totalBatchCount: integer (int64-object) - 同步总批次
        - totalCount: integer (int64-object) - 同步总条数
      - srcDsInfo: string - 源端信息（库-表）
      - successCount: integer (int64-object) - 成功条数
      - syncEndTime: string (date) - 同步结束时间
      - syncInstanceId: integer (int64-object) - 同步实例id
      - syncInstanceName: string - 同步实例名
      - syncResult: string - 同步结果 1 成功 2 失败
      - syncStartTime: string (date) - 同步开始时间
      - syncType: string - 同步类型 1 mysql 2 es
      - targetDsInfo: string - 目标端数据源信息（库-表 or 索引）
      - timeConsuming: integer (int64-object) - 同步总耗时
      - topic: string - mq的topic
      - totalCount: integer (int64-object) - 同步总条数
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值
  - pageNo: integer (int32)
  - pageSize: integer (int32)

#### POST /teapot/etlSyncLog/update
- summary: 更新EtlSyncLog
- operationId: update
- tags: 全量同步日志EtlSyncLog管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.EtlSyncLogParam
  - createTime: string (date) - 创建时间
  - errorMsg: string - 失败原因
  - failCount: integer (int64-object) - 失败条数
  - id: integer (int64-object) - id
  - logType: integer (int32-object) - 日志类型 1全量同步日志 2 补偿同步日志 3 断点续传日志
  - operateUserId: integer (int64-object) - 操作人id
  - relateLog: integer (int64-object) - 补偿日志的关联日志id
  - srcDsInfo: string - 源端信息（库-表）
  - successCount: integer (int64-object) - 成功条数
  - syncEndTime: string (date) - 同步结束时间
  - syncInstanceId: integer (int64-object) - 同步实例id
  - syncInstanceName: string - 同步实例名
  - syncResult: integer (int32-object) - 同步结果 1 成功 2 失败
  - syncStartTime: string (date) - 同步开始时间
  - syncType: integer (int32-object) - 同步类型 1 mysql 2 es
  - targetDsInfo: string - 目标端数据源信息（库-表 or 索引）
  - timeConsuming: integer (int64-object) - 同步总耗时
  - topic: string - mq的topic
  - totalCount: integer (int64-object) - 同步总条数
  - updateTime: string (date) - 更新时间

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/syncInstance/copy
- summary: 复制SyncInstance到指定环境
- operationId: copy
- tags: 同步任务实例表SyncInstance管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.SyncInstanceCopyParam
  - env: string - 环境 prod, test
  - id: integer (int64-object) - 实例id
  - instanceName: string - 指定新实例的名字，可为空
  - sameDsId: integer (int64-object) - 所有表都在同一个数据源情况，无需给表名和数据源id对应关系
  - tableNameDsIdMap: object - 跨环境复制实例-数据源已存在，复用情况
    - additionalProperties: integer (int64-object)
  - tableNameDsInfoParamList: array<ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>> - 跨环境迁移，补全表对应的数据源信息
    - items: ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>
      - dsInfoParam: ref<com.ruijing.sync.common.param.DsInfoParam> - 实例中表对应的数据源信息（一般来说只有一个）
        - id: integer (int64-object) - id
        - name: string - 数据源名
        - password: string - 密码
        - properties: object - 额外信息
          - (value): object - 额外信息
        - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
        - url: string - 数据源连接url
        - userName: string - 用户名
      - tableNameList: array<string> - 实例的表
        - items: string

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.SyncInstanceVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.SyncInstanceVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - createUserGuid: string - 创建人guid
    - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - mappingId: integer (int64-object) - 映射关系Id
    - mappingJson: object - 映射关系json
      - (value): object - 映射关系json
    - pushType: integer (int32-object) - 实例目标端推送数据方式
    - srcDsIdList: string - 源数据库id数组
    - srcTableName: string - 源数据表名
    - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
    - targetTableName: string - 目标表/索引名
    - team: string - 同步实例所属团队
    - topicList: string - mq的topic
    - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### POST /teapot/syncInstance/delete
- summary: 删除SyncInstance
- operationId: delete
- tags: 同步任务实例表SyncInstance管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.DeleteParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/syncInstance/getSyncInstance
- summary: id 查询SyncInstance
- operationId: queryById
- tags: 同步任务实例表SyncInstance管理

##### Request
- query (body), required: False
  - schema: com.ruijing.sync.common.query.SyncInstanceQuery
  - id: integer (int64-object) - id
  - idList: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.SyncInstanceVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.SyncInstanceVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - createUserGuid: string - 创建人guid
    - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - mappingId: integer (int64-object) - 映射关系Id
    - mappingJson: object - 映射关系json
      - (value): object - 映射关系json
    - pushType: integer (int32-object) - 实例目标端推送数据方式
    - srcDsIdList: string - 源数据库id数组
    - srcTableName: string - 源数据表名
    - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
    - targetTableName: string - 目标表/索引名
    - team: string - 同步实例所属团队
    - topicList: string - mq的topic
    - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### POST /teapot/syncInstance/insert
- summary: 新增SyncInstance
- operationId: insert
- tags: 同步任务实例表SyncInstance管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.SyncInstanceParam
  - clickhouseMappingParam: ref<com.ruijing.sync.common.param.ClickhouseMappingParam> - clickhouse同步类型的额外参数,syncType为 3 时传
    - (value): object
  - createUserGuid: string - 创建人guid
  - esMappingParam: ref<com.ruijing.sync.common.param.EsMappingParam> - es同步类型的额外参数,syncType为 2 时传
    - esIndexId: string - es主键字段名
    - etlCondition: string - 全量同步额外条件
    - indexName: string - 索引名
    - methodMappings: object - 计算值映射关系
      - (value): object - 计算值映射关系
  - id: integer (int64-object) - id
  - instanceName: string - 任务实例名
  - rdbMappingParam: ref<com.ruijing.sync.common.param.RdbMappingParam> - rdb同步类型的额外参数,syncType为 1 时传
    - etlCondition: string - 全量同步额外条件
  - syncType: integer (int32-object) - 同步类型 1 rdb 2 es 3 clickhouse
  - team: string - 同步实例所属团队

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.SyncInstanceVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.SyncInstanceVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - createUserGuid: string - 创建人guid
    - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - mappingId: integer (int64-object) - 映射关系Id
    - mappingJson: object - 映射关系json
      - (value): object - 映射关系json
    - pushType: integer (int32-object) - 实例目标端推送数据方式
    - srcDsIdList: string - 源数据库id数组
    - srcTableName: string - 源数据表名
    - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
    - targetTableName: string - 目标表/索引名
    - team: string - 同步实例所属团队
    - topicList: string - mq的topic
    - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### POST /teapot/syncInstance/log/config
- summary: SyncInstance日志启停
- operationId: logConfig
- tags: 同步任务实例表SyncInstance管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.SyncInstanceLogConfigParam
  - enableLog: boolean (boolean-object) - 是否为启用日志
  - ids: array<integer (int64-object)> - 实例id列表
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/syncInstance/page
- summary: SyncInstance 分页查询
- operationId: queryByPage
- tags: 同步任务实例表SyncInstance管理

##### Request
- pageQuery (body), required: False
  - schema: com.ruijing.sync.common.query.SyncInstancePageQuery
  - createTimeEnd: string (date) - 创建时间止
  - createTimeStart: string (date) - 创建时间起
  - createUserGuid: string - 创建人guid
  - enableLog: integer (int32-object) - 是否开启日志 1 开启 0 关闭
  - idList: array<integer (int64-object)> - id数组
    - items: integer (int64-object)
  - instanceName: string - 任务实例名
  - pageNo: integer (int32-object)
  - pageSize: integer (int32-object)
  - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
  - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
  - team: string - 同步实例所属团队

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.PageableResponsejava.util.Listcom.ruijing.sync.common.vo.SyncInstancePageVO
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.SyncInstancePageVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.SyncInstancePageVO>
      - createTime: string (date) - 创建时间
      - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
      - id: integer (int64-object) - id
      - instanceName: string - 任务实例名
      - srcTableName: string - 源数据表名
      - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
      - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
      - targetTableName: string - 目标表/索引名
      - team: string - 同步实例所属团队
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值
  - pageNo: integer (int32)
  - pageSize: integer (int32)

#### POST /teapot/syncInstance/publish
- summary: SyncInstance发布
- operationId: publish
- tags: 同步任务实例表SyncInstance管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.IdsParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.SyncInstancePublishVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.SyncInstancePublishVO> - 返回结果数据
    - checkError: string - 校验错误信息
    - success: boolean (boolean-object) - 是否发布成功
  - msg: string - 异常结果返回值

#### POST /teapot/syncInstance/status
- summary: SyncInstance启停
- operationId: changeStatus
- tags: 同步任务实例表SyncInstance管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.SyncInstanceStatusParam
  - id: integer (int64-object) - 实例id
  - status: integer (int32-object) - 实例变更状态 1 启用 2 禁用

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/syncInstance/update
- summary: 更新SyncInstance
- operationId: update
- tags: 同步任务实例表SyncInstance管理

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.SyncInstanceUpdateParam
  - esMappingUpdateParam: ref<com.ruijing.sync.common.param.EsMappingUpdateParam> - es同步类型的额外参数,syncType为 2 时传
    - etlCondition: string - 全量同步额外条件
    - id: integer (int64-object) - id
    - methodMappings: object - 计算值映射关系
      - (value): object - 计算值映射关系
  - id: integer (int64-object) - id
  - instanceName: string - 任务实例名
  - rdbMappingUpdateParam: ref<com.ruijing.sync.common.param.RdbMappingUpdateParam> - rdb同步类型的额外参数,syncType为 1 时传
    - id: integer (int64-object) - id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

### Schemas

#### com.ruijing.fundamental.api.remote.PageableResponse
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: object - 返回结果数据
    - (value): object - 返回结果数据
  - msg: string - 异常结果返回值
  - pageNo: integer (int32)
  - pageSize: integer (int32)

#### com.ruijing.fundamental.api.remote.PageableResponsejava.util.Listcom.ruijing.sync.common.vo.DsInfoPageVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.DsInfoPageVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.DsInfoPageVO>
      - createTime: string (date) - 创建时间
      - id: integer (int64-object) - id
      - name: string - 数据源名
      - properties: string - 额外信息
      - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
      - updateTime: string (date) - 更新时间
      - url: string - 数据源连接url
  - msg: string - 异常结果返回值
  - pageNo: integer (int32)
  - pageSize: integer (int32)

#### com.ruijing.fundamental.api.remote.PageableResponsejava.util.Listcom.ruijing.sync.common.vo.EtlSyncLogVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EtlSyncLogVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EtlSyncLogVO>
      - createTime: string (date) - 创建时间
      - errorMsg: string - 失败原因
      - failCount: integer (int64-object) - 失败条数
      - id: integer (int64-object) - id
      - logType: integer (int32-object) - 日志类型 0全量同步日志 1 补偿同步日志 2 断点续传日志
      - operateUserId: integer (int64-object) - 操作人id
      - relateLog: ref<com.ruijing.sync.common.vo.EtlSyncLogVO> - 补偿日志的关联日志
        - (circular ref: com.ruijing.sync.common.vo.EtlSyncLogVO)
      - snapshotId: string
      - snapshotJson: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>
        - failCount: integer (int64-object) - 失败条数
        - filterCnt: integer (int64-object) - 过滤条数
        - instanceId: integer (int64-object) - 实例id
        - instanceName: string - 实例名
        - orgId: integer (int32-object) - 单位id（本地部署）
        - sharded: boolean (boolean-object) - 是否为水平分表
        - snapshotId: string - 快照id
        - successCount: integer (int64-object) - 成功条数
        - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
        - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
          - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
            - curBatch: integer (int64-object) - 当前同步批次
            - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
              - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
                - batchId: integer (int64-object) - 批次id
                - batchSize: integer (int64-object) - 当前批次同步数量
                - maxDataId: integer (int64-object) - 当前批次最大id
                - minDataId: integer (int64-object) - 当前批次起始id
            - failCount: integer (int64-object) - 失败条数
            - filterCnt: integer (int64-object) - 过滤条数
            - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
              - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
                - batchId: integer (int64-object) - 批次id
                - batchSize: integer (int64-object) - 当前批次同步数量
                - maxDataId: integer (int64-object) - 当前批次最大id
                - minDataId: integer (int64-object) - 当前批次起始id
            - successCount: integer (int64-object) - 成功条数
            - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
            - tableDataCount: integer (int64-object) - 当前表总数据量
            - tableName: string - 表名
            - totalBatchCount: integer (int64-object) - 同步总批次
        - totalCount: integer (int64-object) - 同步总条数
      - srcDsInfo: string - 源端信息（库-表）
      - successCount: integer (int64-object) - 成功条数
      - syncEndTime: string (date) - 同步结束时间
      - syncInstanceId: integer (int64-object) - 同步实例id
      - syncInstanceName: string - 同步实例名
      - syncResult: string - 同步结果 1 成功 2 失败
      - syncStartTime: string (date) - 同步开始时间
      - syncType: string - 同步类型 1 mysql 2 es
      - targetDsInfo: string - 目标端数据源信息（库-表 or 索引）
      - timeConsuming: integer (int64-object) - 同步总耗时
      - topic: string - mq的topic
      - totalCount: integer (int64-object) - 同步总条数
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值
  - pageNo: integer (int32)
  - pageSize: integer (int32)

#### com.ruijing.fundamental.api.remote.PageableResponsejava.util.Listcom.ruijing.sync.common.vo.SyncInstancePageVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.SyncInstancePageVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.SyncInstancePageVO>
      - createTime: string (date) - 创建时间
      - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
      - id: integer (int64-object) - id
      - instanceName: string - 任务实例名
      - srcTableName: string - 源数据表名
      - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
      - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
      - targetTableName: string - 目标表/索引名
      - team: string - 同步实例所属团队
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值
  - pageNo: integer (int32)
  - pageSize: integer (int32)

#### com.ruijing.fundamental.api.remote.RemoteResponse
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: object - 返回结果数据
    - (value): object - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.DsInfoVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.DsInfoVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - id: integer (int64-object) - id
    - name: string - 数据源名
    - password: string - 密码
    - properties: string - 额外信息
    - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
    - updateTime: string (date) - 更新时间
    - url: string - 数据源连接url
    - userName: string - 用户名
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.EtlSyncLogVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.EtlSyncLogVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - errorMsg: string - 失败原因
    - failCount: integer (int64-object) - 失败条数
    - id: integer (int64-object) - id
    - logType: integer (int32-object) - 日志类型 0全量同步日志 1 补偿同步日志 2 断点续传日志
    - operateUserId: integer (int64-object) - 操作人id
    - relateLog: ref<com.ruijing.sync.common.vo.EtlSyncLogVO> - 补偿日志的关联日志
      - (circular ref: com.ruijing.sync.common.vo.EtlSyncLogVO)
    - snapshotId: string
    - snapshotJson: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>
      - failCount: integer (int64-object) - 失败条数
      - filterCnt: integer (int64-object) - 过滤条数
      - instanceId: integer (int64-object) - 实例id
      - instanceName: string - 实例名
      - orgId: integer (int32-object) - 单位id（本地部署）
      - sharded: boolean (boolean-object) - 是否为水平分表
      - snapshotId: string - 快照id
      - successCount: integer (int64-object) - 成功条数
      - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
      - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
          - curBatch: integer (int64-object) - 当前同步批次
          - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - failCount: integer (int64-object) - 失败条数
          - filterCnt: integer (int64-object) - 过滤条数
          - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - successCount: integer (int64-object) - 成功条数
          - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
          - tableDataCount: integer (int64-object) - 当前表总数据量
          - tableName: string - 表名
          - totalBatchCount: integer (int64-object) - 同步总批次
      - totalCount: integer (int64-object) - 同步总条数
    - srcDsInfo: string - 源端信息（库-表）
    - successCount: integer (int64-object) - 成功条数
    - syncEndTime: string (date) - 同步结束时间
    - syncInstanceId: integer (int64-object) - 同步实例id
    - syncInstanceName: string - 同步实例名
    - syncResult: string - 同步结果 1 成功 2 失败
    - syncStartTime: string (date) - 同步开始时间
    - syncType: string - 同步类型 1 mysql 2 es
    - targetDsInfo: string - 目标端数据源信息（库-表 or 索引）
    - timeConsuming: integer (int64-object) - 同步总耗时
    - topic: string - mq的topic
    - totalCount: integer (int64-object) - 同步总条数
    - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.SyncInstancePublishVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.SyncInstancePublishVO> - 返回结果数据
    - checkError: string - 校验错误信息
    - success: boolean (boolean-object) - 是否发布成功
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.SyncInstanceVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.SyncInstanceVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - createUserGuid: string - 创建人guid
    - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - mappingId: integer (int64-object) - 映射关系Id
    - mappingJson: object - 映射关系json
      - (value): object - 映射关系json
    - pushType: integer (int32-object) - 实例目标端推送数据方式
    - srcDsIdList: string - 源数据库id数组
    - srcTableName: string - 源数据表名
    - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
    - targetTableName: string - 目标表/索引名
    - team: string - 同步实例所属团队
    - topicList: string - mq的topic
    - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listjava.lang.String
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<string> - 返回结果数据
    - items: string
  - msg: string - 异常结果返回值

#### com.ruijing.sync.common.param.ClickhouseMappingParam
- structure:
  - (value): object

#### com.ruijing.sync.common.param.DeleteParam
- structure:
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

#### com.ruijing.sync.common.param.DsInfoParam
- structure:
  - id: integer (int64-object) - id
  - name: string - 数据源名
  - password: string - 密码
  - properties: object - 额外信息
    - (value): object - 额外信息
  - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
  - url: string - 数据源连接url
  - userName: string - 用户名

#### com.ruijing.sync.common.param.EsMappingParam
- structure:
  - esIndexId: string - es主键字段名
  - etlCondition: string - 全量同步额外条件
  - indexName: string - 索引名
  - methodMappings: object - 计算值映射关系
    - (value): object - 计算值映射关系

#### com.ruijing.sync.common.param.EsMappingUpdateParam
- structure:
  - etlCondition: string - 全量同步额外条件
  - id: integer (int64-object) - id
  - methodMappings: object - 计算值映射关系
    - (value): object - 计算值映射关系

#### com.ruijing.sync.common.param.EtlSyncLogParam
- structure:
  - createTime: string (date) - 创建时间
  - errorMsg: string - 失败原因
  - failCount: integer (int64-object) - 失败条数
  - id: integer (int64-object) - id
  - logType: integer (int32-object) - 日志类型 1全量同步日志 2 补偿同步日志 3 断点续传日志
  - operateUserId: integer (int64-object) - 操作人id
  - relateLog: integer (int64-object) - 补偿日志的关联日志id
  - srcDsInfo: string - 源端信息（库-表）
  - successCount: integer (int64-object) - 成功条数
  - syncEndTime: string (date) - 同步结束时间
  - syncInstanceId: integer (int64-object) - 同步实例id
  - syncInstanceName: string - 同步实例名
  - syncResult: integer (int32-object) - 同步结果 1 成功 2 失败
  - syncStartTime: string (date) - 同步开始时间
  - syncType: integer (int32-object) - 同步类型 1 mysql 2 es
  - targetDsInfo: string - 目标端数据源信息（库-表 or 索引）
  - timeConsuming: integer (int64-object) - 同步总耗时
  - topic: string - mq的topic
  - totalCount: integer (int64-object) - 同步总条数
  - updateTime: string (date) - 更新时间

#### com.ruijing.sync.common.param.IdsParam
- structure:
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

#### com.ruijing.sync.common.param.RdbMappingParam
- structure:
  - etlCondition: string - 全量同步额外条件

#### com.ruijing.sync.common.param.RdbMappingUpdateParam
- structure:
  - id: integer (int64-object) - id

#### com.ruijing.sync.common.param.SyncInstanceCopyParam
- structure:
  - env: string - 环境 prod, test
  - id: integer (int64-object) - 实例id
  - instanceName: string - 指定新实例的名字，可为空
  - sameDsId: integer (int64-object) - 所有表都在同一个数据源情况，无需给表名和数据源id对应关系
  - tableNameDsIdMap: object - 跨环境复制实例-数据源已存在，复用情况
    - additionalProperties: integer (int64-object)
  - tableNameDsInfoParamList: array<ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>> - 跨环境迁移，补全表对应的数据源信息
    - items: ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>
      - dsInfoParam: ref<com.ruijing.sync.common.param.DsInfoParam> - 实例中表对应的数据源信息（一般来说只有一个）
        - id: integer (int64-object) - id
        - name: string - 数据源名
        - password: string - 密码
        - properties: object - 额外信息
          - (value): object - 额外信息
        - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
        - url: string - 数据源连接url
        - userName: string - 用户名
      - tableNameList: array<string> - 实例的表
        - items: string

#### com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam
- structure:
  - dsInfoParam: ref<com.ruijing.sync.common.param.DsInfoParam> - 实例中表对应的数据源信息（一般来说只有一个）
    - id: integer (int64-object) - id
    - name: string - 数据源名
    - password: string - 密码
    - properties: object - 额外信息
      - (value): object - 额外信息
    - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
    - url: string - 数据源连接url
    - userName: string - 用户名
  - tableNameList: array<string> - 实例的表
    - items: string

#### com.ruijing.sync.common.param.SyncInstanceLogConfigParam
- structure:
  - enableLog: boolean (boolean-object) - 是否为启用日志
  - ids: array<integer (int64-object)> - 实例id列表
    - items: integer (int64-object)

#### com.ruijing.sync.common.param.SyncInstanceParam
- structure:
  - clickhouseMappingParam: ref<com.ruijing.sync.common.param.ClickhouseMappingParam> - clickhouse同步类型的额外参数,syncType为 3 时传
    - (value): object
  - createUserGuid: string - 创建人guid
  - esMappingParam: ref<com.ruijing.sync.common.param.EsMappingParam> - es同步类型的额外参数,syncType为 2 时传
    - esIndexId: string - es主键字段名
    - etlCondition: string - 全量同步额外条件
    - indexName: string - 索引名
    - methodMappings: object - 计算值映射关系
      - (value): object - 计算值映射关系
  - id: integer (int64-object) - id
  - instanceName: string - 任务实例名
  - rdbMappingParam: ref<com.ruijing.sync.common.param.RdbMappingParam> - rdb同步类型的额外参数,syncType为 1 时传
    - etlCondition: string - 全量同步额外条件
  - syncType: integer (int32-object) - 同步类型 1 rdb 2 es 3 clickhouse
  - team: string - 同步实例所属团队

#### com.ruijing.sync.common.param.SyncInstanceStatusParam
- structure:
  - id: integer (int64-object) - 实例id
  - status: integer (int32-object) - 实例变更状态 1 启用 2 禁用

#### com.ruijing.sync.common.param.SyncInstanceUpdateParam
- structure:
  - esMappingUpdateParam: ref<com.ruijing.sync.common.param.EsMappingUpdateParam> - es同步类型的额外参数,syncType为 2 时传
    - etlCondition: string - 全量同步额外条件
    - id: integer (int64-object) - id
    - methodMappings: object - 计算值映射关系
      - (value): object - 计算值映射关系
  - id: integer (int64-object) - id
  - instanceName: string - 任务实例名
  - rdbMappingUpdateParam: ref<com.ruijing.sync.common.param.RdbMappingUpdateParam> - rdb同步类型的额外参数,syncType为 1 时传
    - id: integer (int64-object) - id

#### com.ruijing.sync.common.query.DsInfoPageQuery
- structure:
  - createTimeEnd: string (date) - 创建时间止
  - createTimeStart: string (date) - 创建时间起
  - idList: array<integer (int64-object)> - idList
    - items: integer (int64-object)
  - name: string - 数据源名
  - pageNo: integer (int32-object)
  - pageSize: integer (int32-object)
  - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...

#### com.ruijing.sync.common.query.DsInfoQuery
- structure:
  - id: integer (int64-object) - id

#### com.ruijing.sync.common.query.EtlSyncLogPageQuery
- structure:
  - createTimeEnd: string (date) - 创建时间止
  - createTimeStart: string (date) - 创建时间起
  - id: integer (int64-object) - id
  - logTypeList: array<integer (int32-object)> - 日志类型 1 mysql 2 es
    - items: integer (int32-object)
  - pageNo: integer (int32-object)
  - pageSize: integer (int32-object)
  - snapshotIdList: array<string> - 同步快照id数组
    - items: string
  - syncInstanceId: integer (int64-object) - 同步实例id
  - syncInstanceName: string - 同步实例名
  - syncResult: integer (int32-object) - 同步结果 1 成功 2 失败
  - syncType: integer (int32-object) - 同步类型 1 mysql 2 es

#### com.ruijing.sync.common.query.EtlSyncLogQuery
- structure:
  - id: integer (int64-object) - id
  - logType: integer (int32-object) - 日志类型 1全量同步日志 2 补偿同步日志 3 断点续传日志
  - syncInstanceId: integer (int64-object) - 同步实例id
  - syncInstanceName: string - 同步实例名
  - syncResult: integer (int32-object) - 同步结果 1 成功 2 失败
  - syncType: integer (int32-object) - 同步类型 1 mysql 2 es
  - topic: string - mq的topic

#### com.ruijing.sync.common.query.SyncInstancePageQuery
- structure:
  - createTimeEnd: string (date) - 创建时间止
  - createTimeStart: string (date) - 创建时间起
  - createUserGuid: string - 创建人guid
  - enableLog: integer (int32-object) - 是否开启日志 1 开启 0 关闭
  - idList: array<integer (int64-object)> - id数组
    - items: integer (int64-object)
  - instanceName: string - 任务实例名
  - pageNo: integer (int32-object)
  - pageSize: integer (int32-object)
  - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
  - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
  - team: string - 同步实例所属团队

#### com.ruijing.sync.common.query.SyncInstanceQuery
- structure:
  - id: integer (int64-object) - id
  - idList: array<integer (int64-object)>
    - items: integer (int64-object)

#### com.ruijing.sync.common.vo.DsInfoPageVO
- structure:
  - createTime: string (date) - 创建时间
  - id: integer (int64-object) - id
  - name: string - 数据源名
  - properties: string - 额外信息
  - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
  - updateTime: string (date) - 更新时间
  - url: string - 数据源连接url

#### com.ruijing.sync.common.vo.DsInfoVO
- structure:
  - createTime: string (date) - 创建时间
  - id: integer (int64-object) - id
  - name: string - 数据源名
  - password: string - 密码
  - properties: string - 额外信息
  - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
  - updateTime: string (date) - 更新时间
  - url: string - 数据源连接url
  - userName: string - 用户名

#### com.ruijing.sync.common.vo.EtlProgressSnapshot
- structure:
  - failCount: integer (int64-object) - 失败条数
  - filterCnt: integer (int64-object) - 过滤条数
  - instanceId: integer (int64-object) - 实例id
  - instanceName: string - 实例名
  - orgId: integer (int32-object) - 单位id（本地部署）
  - sharded: boolean (boolean-object) - 是否为水平分表
  - snapshotId: string - 快照id
  - successCount: integer (int64-object) - 成功条数
  - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
  - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
      - curBatch: integer (int64-object) - 当前同步批次
      - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
          - batchId: integer (int64-object) - 批次id
          - batchSize: integer (int64-object) - 当前批次同步数量
          - maxDataId: integer (int64-object) - 当前批次最大id
          - minDataId: integer (int64-object) - 当前批次起始id
      - failCount: integer (int64-object) - 失败条数
      - filterCnt: integer (int64-object) - 过滤条数
      - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
          - batchId: integer (int64-object) - 批次id
          - batchSize: integer (int64-object) - 当前批次同步数量
          - maxDataId: integer (int64-object) - 当前批次最大id
          - minDataId: integer (int64-object) - 当前批次起始id
      - successCount: integer (int64-object) - 成功条数
      - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
      - tableDataCount: integer (int64-object) - 当前表总数据量
      - tableName: string - 表名
      - totalBatchCount: integer (int64-object) - 同步总批次
  - totalCount: integer (int64-object) - 同步总条数

#### com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo
- structure:
  - batchId: integer (int64-object) - 批次id
  - batchSize: integer (int64-object) - 当前批次同步数量
  - maxDataId: integer (int64-object) - 当前批次最大id
  - minDataId: integer (int64-object) - 当前批次起始id

#### com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo
- structure:
  - curBatch: integer (int64-object) - 当前同步批次
  - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
      - batchId: integer (int64-object) - 批次id
      - batchSize: integer (int64-object) - 当前批次同步数量
      - maxDataId: integer (int64-object) - 当前批次最大id
      - minDataId: integer (int64-object) - 当前批次起始id
  - failCount: integer (int64-object) - 失败条数
  - filterCnt: integer (int64-object) - 过滤条数
  - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
      - batchId: integer (int64-object) - 批次id
      - batchSize: integer (int64-object) - 当前批次同步数量
      - maxDataId: integer (int64-object) - 当前批次最大id
      - minDataId: integer (int64-object) - 当前批次起始id
  - successCount: integer (int64-object) - 成功条数
  - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
  - tableDataCount: integer (int64-object) - 当前表总数据量
  - tableName: string - 表名
  - totalBatchCount: integer (int64-object) - 同步总批次

#### com.ruijing.sync.common.vo.EtlSyncLogVO
- structure:
  - createTime: string (date) - 创建时间
  - errorMsg: string - 失败原因
  - failCount: integer (int64-object) - 失败条数
  - id: integer (int64-object) - id
  - logType: integer (int32-object) - 日志类型 0全量同步日志 1 补偿同步日志 2 断点续传日志
  - operateUserId: integer (int64-object) - 操作人id
  - relateLog: ref<com.ruijing.sync.common.vo.EtlSyncLogVO> - 补偿日志的关联日志
    - (circular ref: com.ruijing.sync.common.vo.EtlSyncLogVO)
  - snapshotId: string
  - snapshotJson: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>
    - failCount: integer (int64-object) - 失败条数
    - filterCnt: integer (int64-object) - 过滤条数
    - instanceId: integer (int64-object) - 实例id
    - instanceName: string - 实例名
    - orgId: integer (int32-object) - 单位id（本地部署）
    - sharded: boolean (boolean-object) - 是否为水平分表
    - snapshotId: string - 快照id
    - successCount: integer (int64-object) - 成功条数
    - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
    - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
      - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
        - curBatch: integer (int64-object) - 当前同步批次
        - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
          - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
            - batchId: integer (int64-object) - 批次id
            - batchSize: integer (int64-object) - 当前批次同步数量
            - maxDataId: integer (int64-object) - 当前批次最大id
            - minDataId: integer (int64-object) - 当前批次起始id
        - failCount: integer (int64-object) - 失败条数
        - filterCnt: integer (int64-object) - 过滤条数
        - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
          - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
            - batchId: integer (int64-object) - 批次id
            - batchSize: integer (int64-object) - 当前批次同步数量
            - maxDataId: integer (int64-object) - 当前批次最大id
            - minDataId: integer (int64-object) - 当前批次起始id
        - successCount: integer (int64-object) - 成功条数
        - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
        - tableDataCount: integer (int64-object) - 当前表总数据量
        - tableName: string - 表名
        - totalBatchCount: integer (int64-object) - 同步总批次
    - totalCount: integer (int64-object) - 同步总条数
  - srcDsInfo: string - 源端信息（库-表）
  - successCount: integer (int64-object) - 成功条数
  - syncEndTime: string (date) - 同步结束时间
  - syncInstanceId: integer (int64-object) - 同步实例id
  - syncInstanceName: string - 同步实例名
  - syncResult: string - 同步结果 1 成功 2 失败
  - syncStartTime: string (date) - 同步开始时间
  - syncType: string - 同步类型 1 mysql 2 es
  - targetDsInfo: string - 目标端数据源信息（库-表 or 索引）
  - timeConsuming: integer (int64-object) - 同步总耗时
  - topic: string - mq的topic
  - totalCount: integer (int64-object) - 同步总条数
  - updateTime: string (date) - 更新时间

#### com.ruijing.sync.common.vo.SyncInstancePageVO
- structure:
  - createTime: string (date) - 创建时间
  - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
  - id: integer (int64-object) - id
  - instanceName: string - 任务实例名
  - srcTableName: string - 源数据表名
  - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
  - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
  - targetTableName: string - 目标表/索引名
  - team: string - 同步实例所属团队
  - updateTime: string (date) - 更新时间

#### com.ruijing.sync.common.vo.SyncInstancePublishVO
- structure:
  - checkError: string - 校验错误信息
  - success: boolean (boolean-object) - 是否发布成功

#### com.ruijing.sync.common.vo.SyncInstanceVO
- structure:
  - createTime: string (date) - 创建时间
  - createUserGuid: string - 创建人guid
  - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
  - id: integer (int64-object) - id
  - instanceName: string - 任务实例名
  - mappingId: integer (int64-object) - 映射关系Id
  - mappingJson: object - 映射关系json
    - (value): object - 映射关系json
  - pushType: integer (int32-object) - 实例目标端推送数据方式
  - srcDsIdList: string - 源数据库id数组
  - srcTableName: string - 源数据表名
  - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
  - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
  - targetTableName: string - 目标表/索引名
  - team: string - 同步实例所属团队
  - topicList: string - mq的topic
  - updateTime: string (date) - 更新时间

## es.json
- title: msharp_teapot_adapter_es
- version: 1.0.0
- description: msharp_teapot_adapter_es
- host: cloud.rj-info.com
- basePath: /teapot
- schemes: http

### Endpoints

#### POST /teapot/es/columnItem/delete
- summary: 删除列映射信息
- operationId: deleteColumnItem
- tags: es类型映射关系

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.IdsParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/es/columnItem/insert
- summary: 批量新增列映射信息
- operationId: insertColumnItem
- tags: es类型映射关系

##### Request
- request (body), required: False
  - schema: com.ruijing.sync.adapter.es.controller.request.EsColumnItemRequest
  - columnItemList: array<ref<com.ruijing.sync.adapter.es.controller.param.EsColumnItemParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.es.controller.param.EsColumnItemParam>
      - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
      - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 所属表id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.es.mapping.entity.EsColumnItem
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>
      - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
      - createTime: string (date) - 创建时间
      - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### POST /teapot/es/columnItem/mappingAll
- summary: 获取mappingAll列映射信息
- operationId: getMappingAllColumnItem
- tags: es类型映射关系

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.MappingColumnParam
  - dsInfoId: integer (int64-object) - 数据源id
  - tableName: string - 表名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - msg: string - 异常结果返回值

#### POST /teapot/es/columnItem/update
- summary: 批量更新列映射信息
- operationId: updateColumnItem
- tags: es类型映射关系

##### Request
- request (body), required: False
  - schema: com.ruijing.sync.adapter.es.controller.request.EsColumnItemUpdateRequest
  - columnItemList: array<ref<com.ruijing.sync.adapter.es.controller.param.EsColumnItemUpdateParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.es.controller.param.EsColumnItemUpdateParam>
      - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
      - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/es/index/changeAlias
- summary: 切换别名
- operationId: changeAlias
- tags: es文档相关业务

##### Request
- request (body), required: False
  - schema: com.ruijing.sync.adapter.core.param.etl.EsAliasParam
  - key: string - 索引操作

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/es/tableItem/delete
- summary: 批量删除表结构信息
- operationId: deleteTableItem
- tags: es类型映射关系

##### Request
- param (body), required: False
  - schema: com.ruijing.sync.common.param.IdsParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/es/tableItem/insert
- summary: 批量新增表结构信息
- operationId: insertTableItem
- tags: es类型映射关系

##### Request
- request (body), required: False
  - schema: com.ruijing.sync.adapter.es.controller.request.EsTableItemRequest
  - instanceId: integer (int64-object) - 所属实例id
  - mappingId: integer (int64-object) - 所属映射关系id
  - tableItemList: array<ref<com.ruijing.sync.adapter.es.controller.param.EsTableItemParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.es.controller.param.EsTableItemParam>
      - dbName: string - dbName
      - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
      - master: boolean (boolean-object) - 是否主表
      - nestedKey: string - es的nested字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
      - updateTimeColumnName: string - 标识更新时间的字段名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.es.mapping.entity.EsTableItem
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.es.mapping.entity.EsTableItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.es.mapping.entity.EsTableItem>
      - columnItemList: array<ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>> - 表字段映射关系
        - items: ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>
          - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
          - createTime: string (date) - 创建时间
          - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
          - foreignKey: boolean (boolean-object) - 是否为主表外键
          - id: integer (int64-object) - id
          - mainTableFk: string - 子表对应主表外键列名
          - needData: boolean (boolean-object) - 是否需要该数据
          - primaryKey: boolean (boolean-object) - 是否为主键
          - srcColumnName: string - 源表字段名
          - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 该列所属表映射信息id
          - targetColumnName: string - 映射到目标字段名
          - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - updateTime: string (date) - 更新时间
      - createTime: string (date) - 创建时间
      - dbName: string - dbName
      - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
      - id: integer (int64-object) - id
      - instanceId: integer (int64-object) - id
      - mappingId: integer (int64-object) - 表映射对应的mapping信息id
      - master: boolean (boolean-object) - 是否主表
      - nestedKey: string - es的nested字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取库名_表名)
      - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
      - updateTime: string (date) - 更新时间
      - updateTimeColumnName: string - 标识更新时间的字段名
  - msg: string - 异常结果返回值

#### POST /teapot/es/tableItem/update
- summary: 更新表结构信息
- operationId: updateTableItem
- tags: es类型映射关系

##### Request
- request (body), required: False
  - schema: com.ruijing.sync.adapter.es.controller.request.EsTableItemUpdateRequest
  - tableItemList: array<ref<com.ruijing.sync.adapter.es.controller.param.EsTableItemUpdateParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.es.controller.param.EsTableItemUpdateParam>
      - dbName: string - dbName
      - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
      - id: integer (int64-object) - id
      - master: boolean (boolean-object) - 是否主表
      - nestedKey: string - es的nested字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
      - updateTimeColumnName: string - 标识更新时间的字段名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

### Schemas

#### com.ruijing.fundamental.api.remote.RemoteResponse
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: object - 返回结果数据
    - (value): object - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.es.mapping.entity.EsColumnItem
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>
      - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
      - createTime: string (date) - 创建时间
      - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.es.mapping.entity.EsTableItem
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.es.mapping.entity.EsTableItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.es.mapping.entity.EsTableItem>
      - columnItemList: array<ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>> - 表字段映射关系
        - items: ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>
          - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
          - createTime: string (date) - 创建时间
          - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
          - foreignKey: boolean (boolean-object) - 是否为主表外键
          - id: integer (int64-object) - id
          - mainTableFk: string - 子表对应主表外键列名
          - needData: boolean (boolean-object) - 是否需要该数据
          - primaryKey: boolean (boolean-object) - 是否为主键
          - srcColumnName: string - 源表字段名
          - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 该列所属表映射信息id
          - targetColumnName: string - 映射到目标字段名
          - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - updateTime: string (date) - 更新时间
      - createTime: string (date) - 创建时间
      - dbName: string - dbName
      - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
      - id: integer (int64-object) - id
      - instanceId: integer (int64-object) - id
      - mappingId: integer (int64-object) - 表映射对应的mapping信息id
      - master: boolean (boolean-object) - 是否主表
      - nestedKey: string - es的nested字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取库名_表名)
      - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
      - updateTime: string (date) - 更新时间
      - updateTimeColumnName: string - 标识更新时间的字段名
  - msg: string - 异常结果返回值

#### com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
- structure:
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.core.param.etl.EsAliasParam
- structure:
  - key: string - 索引操作

#### com.ruijing.sync.adapter.es.controller.param.EsColumnItemParam
- structure:
  - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
  - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.es.controller.param.EsColumnItemUpdateParam
- structure:
  - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
  - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - id: integer (int64-object) - id
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.es.controller.param.EsTableItemParam
- structure:
  - dbName: string - dbName
  - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
  - master: boolean (boolean-object) - 是否主表
  - nestedKey: string - es的nested字段名
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - shardedCount: integer (int32-object) - 水平分表的分片数
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - tableNameRegex: string - 表名正则（表被水平拆分时）
  - topic: string - 表对应的topic(topic未指定默认取表名)
  - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.es.controller.param.EsTableItemUpdateParam
- structure:
  - dbName: string - dbName
  - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
  - id: integer (int64-object) - id
  - master: boolean (boolean-object) - 是否主表
  - nestedKey: string - es的nested字段名
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - shardedCount: integer (int32-object) - 水平分表的分片数
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - tableNameRegex: string - 表名正则（表被水平拆分时）
  - topic: string - 表对应的topic(topic未指定默认取表名)
  - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.es.controller.request.EsColumnItemRequest
- structure:
  - columnItemList: array<ref<com.ruijing.sync.adapter.es.controller.param.EsColumnItemParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.es.controller.param.EsColumnItemParam>
      - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
      - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 所属表id

#### com.ruijing.sync.adapter.es.controller.request.EsColumnItemUpdateRequest
- structure:
  - columnItemList: array<ref<com.ruijing.sync.adapter.es.controller.param.EsColumnItemUpdateParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.es.controller.param.EsColumnItemUpdateParam>
      - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
      - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.es.controller.request.EsTableItemRequest
- structure:
  - instanceId: integer (int64-object) - 所属实例id
  - mappingId: integer (int64-object) - 所属映射关系id
  - tableItemList: array<ref<com.ruijing.sync.adapter.es.controller.param.EsTableItemParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.es.controller.param.EsTableItemParam>
      - dbName: string - dbName
      - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
      - master: boolean (boolean-object) - 是否主表
      - nestedKey: string - es的nested字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
      - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.es.controller.request.EsTableItemUpdateRequest
- structure:
  - tableItemList: array<ref<com.ruijing.sync.adapter.es.controller.param.EsTableItemUpdateParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.es.controller.param.EsTableItemUpdateParam>
      - dbName: string - dbName
      - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
      - id: integer (int64-object) - id
      - master: boolean (boolean-object) - 是否主表
      - nestedKey: string - es的nested字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
      - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem
- structure:
  - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
  - createTime: string (date) - 创建时间
  - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - id: integer (int64-object) - id
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 该列所属表映射信息id
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - updateTime: string (date) - 更新时间

#### com.ruijing.sync.adapter.es.mapping.entity.EsTableItem
- structure:
  - columnItemList: array<ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>> - 表字段映射关系
    - items: ref<com.ruijing.sync.adapter.es.mapping.entity.EsColumnItem>
      - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
      - createTime: string (date) - 创建时间
      - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - createTime: string (date) - 创建时间
  - dbName: string - dbName
  - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
  - id: integer (int64-object) - id
  - instanceId: integer (int64-object) - id
  - mappingId: integer (int64-object) - 表映射对应的mapping信息id
  - master: boolean (boolean-object) - 是否主表
  - nestedKey: string - es的nested字段名
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - shardedCount: integer (int32-object) - 水平分表的分片数
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - tableNameRegex: string - 表名正则（表被水平拆分时）
  - topic: string - 表对应的topic(topic未指定默认取库名_表名)
  - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
  - updateTime: string (date) - 更新时间
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.common.param.IdsParam
- structure:
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

#### com.ruijing.sync.common.param.MappingColumnParam
- structure:
  - dsInfoId: integer (int64-object) - 数据源id
  - tableName: string - 表名

## rdb.json
- title: rdb类型映射关系
- description: rdb类型映射关系
- host: cloud.rj-info.com
- basePath: /teapot
- schemes: http

### Endpoints

#### POST /teapot/rdb/columnItem/delete
- summary: 删除列映射信息
- operationId: deleteColumnItem
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.param.IdsParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/columnItem/insert
- summary: 批量新增列映射信息
- operationId: insertColumnItem
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.rdb.controller.request.RdbColumnItemRequest
  - columnItemList: array<ref<com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemParam>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 所属表id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>
      - createTime: string (date) - 创建时间
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/columnItem/mappingAll
- summary: 获取mappingAll列映射信息
- operationId: getMappingAllColumnItem
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.param.MappingColumnParam
  - dsInfoId: integer (int64-object) - 数据源id
  - tableName: string - 表名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/columnItem/update
- summary: 批量更新列映射信息
- operationId: updateColumnItem
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.rdb.controller.request.RdbColumnItemUpdateRequest
  - columnItemList: array<ref<com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemUpdateParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemUpdateParam>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/localDeploy/modifyOrgSubscribe
- summary: 修改本地部署单位订阅同步实例
- operationId: modifyOrgSubscribe
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.rdb.controller.request.LocalDeployOrgConfigRequest
  - dataCondition: string - 数据过滤条件（sql形式）
  - fieldCondition: string - 数据字段过滤条件（记录需要的字段，逗号隔开）
  - id: integer (int32-object) - id
  - instanceIdList: array<integer (int64-object)> - 订阅实例id数组
    - items: integer (int64-object)
  - orgId: integer (int32-object) - 订阅单位id
  - pushTopic: string - 推送topic

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/localDeploy/orgSubscribe
- summary: 本地部署单位订阅同步实例
- operationId: orgSubscribe
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.rdb.controller.request.LocalDeployOrgConfigRequest
  - dataCondition: string - 数据过滤条件（sql形式）
  - fieldCondition: string - 数据字段过滤条件（记录需要的字段，逗号隔开）
  - id: integer (int32-object) - id
  - instanceIdList: array<integer (int64-object)> - 订阅实例id数组
    - items: integer (int64-object)
  - orgId: integer (int32-object) - 订阅单位id
  - pushTopic: string - 推送topic

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/localDeploy/orgSubscribeList
- summary: 实例单位订阅配置列表
- operationId: orgSubscribeList
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.rdb.controller.request.LocalDeployOrgConfigRequest
  - dataCondition: string - 数据过滤条件（sql形式）
  - fieldCondition: string - 数据字段过滤条件（记录需要的字段，逗号隔开）
  - id: integer (int32-object) - id
  - instanceIdList: array<integer (int64-object)> - 订阅实例id数组
    - items: integer (int64-object)
  - orgId: integer (int32-object) - 订阅单位id
  - pushTopic: string - 推送topic

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.rdb.controller.vo.LocalDeployOrgConfigVO
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.rdb.controller.vo.LocalDeployOrgConfigVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.rdb.controller.vo.LocalDeployOrgConfigVO>
      - dataCondition: string - 数据过滤条件（sql形式）
      - fieldCondition: string - 数据字段过滤条件（记录需要的字段，逗号隔开）
      - id: integer (int32-object) - id
      - instanceId: integer (int64-object) - 订阅实例id
      - orgId: integer (int32-object) - 订阅单位id
      - pushTopic: string - 推送topic
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/tableItem/delete
- summary: 批量删除表结构信息
- operationId: deleteTableItem
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.param.IdsParam
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/tableItem/insert
- summary: 批量新增rdb表结构信息
- operationId: insertTableItem
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.rdb.controller.request.RdbTableItemRequest
  - instanceId: integer (int64-object) - 所属实例id
  - mappingId: integer (int64-object) - 所属映射关系id
  - tableItemList: array<ref<com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemParam>
      - dbName: string - dbName
      - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
      - master: boolean (boolean-object) - 是否主表
      - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
      - orgIdColumnName: string - orgId字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - targetPrimaryKey: string - 目标表主键，用于构造update语句
      - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.rdb.mapping.entity.RdbTableItem
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbTableItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbTableItem>
      - columnItemList: array<ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>> - 表字段映射关系
        - items: ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>
          - createTime: string (date) - 创建时间
          - foreignKey: boolean (boolean-object) - 是否为主表外键
          - id: integer (int64-object) - id
          - mainTableFk: string - 子表对应主表外键列名
          - needData: boolean (boolean-object) - 是否需要该数据
          - primaryKey: boolean (boolean-object) - 是否为主键
          - srcColumnName: string - 源表字段名
          - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 该列所属表映射信息id
          - targetColumnName: string - 映射到目标字段名
          - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - updateTime: string (date) - 更新时间
      - createTime: string (date) - 创建时间
      - dbName: string - dbName
      - id: integer (int64-object) - id
      - instanceId: integer (int64-object) - id
      - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
      - mappingId: integer (int64-object) - 表映射对应的mapping信息id
      - master: boolean (boolean-object) - 是否主表
      - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
      - orgIdColumnName: string - orgId字段名称
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - targetPrimaryKey: string - 目标表主键，用于构造update语句
      - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
      - topic: string - 表对应的topic(topic未指定默认取库名_表名)
      - updateTime: string (date) - 更新时间
      - updateTimeColumnName: string - 标识更新时间的字段名
  - msg: string - 异常结果返回值

#### POST /teapot/rdb/tableItem/update
- summary: 批量更新rdb表结构信息
- operationId: updateTableItem
- tags: rdb类型映射关系

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.rdb.controller.request.RdbTableItemUpdateRequest
  - tableItemList: array<ref<com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemUpdateParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemUpdateParam>
      - dbName: string - dbName
      - id: integer (int64-object) - id
      - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
      - master: boolean (boolean-object) - 是否主表
      - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
      - orgIdColumnName: string - orgId字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - targetPrimaryKey: string - 目标表主键，用于构造update语句
      - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

### Schemas

#### com.ruijing.fundamental.api.remote.RemoteResponse
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: object - 返回结果数据
    - (value): object - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo>
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.rdb.controller.vo.LocalDeployOrgConfigVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.rdb.controller.vo.LocalDeployOrgConfigVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.rdb.controller.vo.LocalDeployOrgConfigVO>
      - dataCondition: string - 数据过滤条件（sql形式）
      - fieldCondition: string - 数据字段过滤条件（记录需要的字段，逗号隔开）
      - id: integer (int32-object) - id
      - instanceId: integer (int64-object) - 订阅实例id
      - orgId: integer (int32-object) - 订阅单位id
      - pushTopic: string - 推送topic
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>
      - createTime: string (date) - 创建时间
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.adapter.rdb.mapping.entity.RdbTableItem
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbTableItem>> - 返回结果数据
    - items: ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbTableItem>
      - columnItemList: array<ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>> - 表字段映射关系
        - items: ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>
          - createTime: string (date) - 创建时间
          - foreignKey: boolean (boolean-object) - 是否为主表外键
          - id: integer (int64-object) - id
          - mainTableFk: string - 子表对应主表外键列名
          - needData: boolean (boolean-object) - 是否需要该数据
          - primaryKey: boolean (boolean-object) - 是否为主键
          - srcColumnName: string - 源表字段名
          - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 该列所属表映射信息id
          - targetColumnName: string - 映射到目标字段名
          - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - updateTime: string (date) - 更新时间
      - createTime: string (date) - 创建时间
      - dbName: string - dbName
      - id: integer (int64-object) - id
      - instanceId: integer (int64-object) - id
      - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
      - mappingId: integer (int64-object) - 表映射对应的mapping信息id
      - master: boolean (boolean-object) - 是否主表
      - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
      - orgIdColumnName: string - orgId字段名称
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - targetPrimaryKey: string - 目标表主键，用于构造update语句
      - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
      - topic: string - 表对应的topic(topic未指定默认取库名_表名)
      - updateTime: string (date) - 更新时间
      - updateTimeColumnName: string - 标识更新时间的字段名
  - msg: string - 异常结果返回值

#### com.ruijing.sync.adapter.core.mapping.ColumnMappingInfo
- structure:
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemParam
- structure:
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemUpdateParam
- structure:
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - id: integer (int64-object) - id
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemParam
- structure:
  - dbName: string - dbName
  - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
  - master: boolean (boolean-object) - 是否主表
  - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
  - orgIdColumnName: string - orgId字段名
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - targetPrimaryKey: string - 目标表主键，用于构造update语句
  - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
  - topic: string - 表对应的topic(topic未指定默认取表名)
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemUpdateParam
- structure:
  - dbName: string - dbName
  - id: integer (int64-object) - id
  - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
  - master: boolean (boolean-object) - 是否主表
  - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
  - orgIdColumnName: string - orgId字段名
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - targetPrimaryKey: string - 目标表主键，用于构造update语句
  - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
  - topic: string - 表对应的topic(topic未指定默认取表名)
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.rdb.controller.request.LocalDeployOrgConfigRequest
- structure:
  - dataCondition: string - 数据过滤条件（sql形式）
  - fieldCondition: string - 数据字段过滤条件（记录需要的字段，逗号隔开）
  - id: integer (int32-object) - id
  - instanceIdList: array<integer (int64-object)> - 订阅实例id数组
    - items: integer (int64-object)
  - orgId: integer (int32-object) - 订阅单位id
  - pushTopic: string - 推送topic

#### com.ruijing.sync.adapter.rdb.controller.request.RdbColumnItemRequest
- structure:
  - columnItemList: array<ref<com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemParam>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 所属表id

#### com.ruijing.sync.adapter.rdb.controller.request.RdbColumnItemUpdateRequest
- structure:
  - columnItemList: array<ref<com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemUpdateParam>> - 列映射信息
    - items: ref<com.ruijing.sync.adapter.rdb.controller.param.RdbColumnItemUpdateParam>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.adapter.rdb.controller.request.RdbTableItemRequest
- structure:
  - instanceId: integer (int64-object) - 所属实例id
  - mappingId: integer (int64-object) - 所属映射关系id
  - tableItemList: array<ref<com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemParam>
      - dbName: string - dbName
      - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
      - master: boolean (boolean-object) - 是否主表
      - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
      - orgIdColumnName: string - orgId字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - targetPrimaryKey: string - 目标表主键，用于构造update语句
      - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.rdb.controller.request.RdbTableItemUpdateRequest
- structure:
  - tableItemList: array<ref<com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemUpdateParam>> - 表映射关系
    - items: ref<com.ruijing.sync.adapter.rdb.controller.param.RdbTableItemUpdateParam>
      - dbName: string - dbName
      - id: integer (int64-object) - id
      - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
      - master: boolean (boolean-object) - 是否主表
      - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
      - orgIdColumnName: string - orgId字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - targetPrimaryKey: string - 目标表主键，用于构造update语句
      - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.adapter.rdb.controller.vo.LocalDeployOrgConfigVO
- structure:
  - dataCondition: string - 数据过滤条件（sql形式）
  - fieldCondition: string - 数据字段过滤条件（记录需要的字段，逗号隔开）
  - id: integer (int32-object) - id
  - instanceId: integer (int64-object) - 订阅实例id
  - orgId: integer (int32-object) - 订阅单位id
  - pushTopic: string - 推送topic

#### com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem
- structure:
  - createTime: string (date) - 创建时间
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - id: integer (int64-object) - id
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 该列所属表映射信息id
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - updateTime: string (date) - 更新时间

#### com.ruijing.sync.adapter.rdb.mapping.entity.RdbTableItem
- structure:
  - columnItemList: array<ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>> - 表字段映射关系
    - items: ref<com.ruijing.sync.adapter.rdb.mapping.entity.RdbColumnItem>
      - createTime: string (date) - 创建时间
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - id: integer (int64-object) - id
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - tableItemId: integer (int64-object) - 该列所属表映射信息id
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - updateTime: string (date) - 更新时间
  - createTime: string (date) - 创建时间
  - dbName: string - dbName
  - id: integer (int64-object) - id
  - instanceId: integer (int64-object) - id
  - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
  - mappingId: integer (int64-object) - 表映射对应的mapping信息id
  - master: boolean (boolean-object) - 是否主表
  - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
  - orgIdColumnName: string - orgId字段名称
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - shardedCount: integer (int32-object) - 水平分表的分片数
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - tableNameRegex: string - 表名正则（表被水平拆分时）
  - targetPrimaryKey: string - 目标表主键，用于构造update语句
  - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
  - topic: string - 表对应的topic(topic未指定默认取库名_表名)
  - updateTime: string (date) - 更新时间
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.common.param.IdsParam
- structure:
  - id: integer (int64-object)
  - ids: array<integer (int64-object)>
    - items: integer (int64-object)

#### com.ruijing.sync.common.param.MappingColumnParam
- structure:
  - dsInfoId: integer (int64-object) - 数据源id
  - tableName: string - 表名

## server.json
- title: msharp_teapot_server
- version: 1.0.0
- description: msharp_teapot_server
- host: cloud.rj-info.com
- basePath: /teapot
- schemes: http

### Endpoints

#### POST /teapot/dict/dataType
- summary: 字段JAVA数据类型
- operationId: dataTypeDict
- tags: 获取枚举值接口

##### Request
- (no parameters)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>
      - key: string
      - val: integer (int32-object)
  - msg: string - 异常结果返回值

#### POST /teapot/dict/dsInfo
- summary: 数据源字典
- operationId: dsInfoDict
- tags: 获取枚举值接口

##### Request
- (no parameters)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Long
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Long>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Long>
      - key: string
      - val: integer (int64-object)
  - msg: string - 异常结果返回值

#### POST /teapot/dict/esMappingType
- summary: ES-表映射类型
- operationId: esMappingTypeDict
- tags: 获取枚举值接口

##### Request
- (no parameters)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>
      - key: string
      - val: integer (int32-object)
  - msg: string - 异常结果返回值

#### POST /teapot/dict/instanceStatus
- summary: 实例状态枚举
- operationId: instanceStatusDict
- tags: 获取枚举值接口

##### Request
- (no parameters)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>
      - key: string
      - val: integer (int32-object)
  - msg: string - 异常结果返回值

#### POST /teapot/dict/syncType
- summary: 同步类型枚举
- operationId: syncTypeDict
- tags: 获取枚举值接口

##### Request
- (no parameters)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>
      - key: string
      - val: integer (int32-object)
  - msg: string - 异常结果返回值

#### POST /teapot/dict/team
- summary: 团队类型枚举
- operationId: teamDict
- tags: 获取枚举值接口

##### Request
- (no parameters)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.String
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.String>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.String>
      - key: string
      - val: string
  - msg: string - 异常结果返回值

#### POST /teapot/etl/breakpointEtl
- summary: ETL断点续传
- operationId: breakpointEtl
- tags: 全量同步

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.core.param.etl.EtlSyncParam
  - conditionsContent: string - 条件内容
  - conditionsType: integer (int32-object) - 条件类型 1 sql过滤，2etl过滤
  - esAliasParam: ref<com.ruijing.sync.adapter.core.param.etl.EsAliasParam> - 更新索引别名操作
    - (value): object
  - instanceId: integer (int64-object) - 实例id
  - orgId: integer (int32-object) - 单位id（本地部署全量同步传）
  - params: array<object> - ETL条件
    - items: object
      - (value): object
  - snapshotId: string - 快照id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/etl/latestSnapshot
- summary: 查询实例还在同步中的快照信息
- operationId: latestSnapshot
- tags: 全量同步

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.query.EtlSnapShotQuery
  - instanceIdList: array<integer (int64-object)> - 同步实例id（传此参数获取某个实例最新的快照信息）
    - items: integer (int64-object)
  - snapshotIdList: array<string> - 快照id（传此参数批量获取快照信息）
    - items: string

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EtlProgressSnapshot
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>
      - consoleLog: string - 控制台日志
      - failCount: integer (int64-object) - 失败条数
      - filterCnt: integer (int64-object) - 过滤条数
      - instanceId: integer (int64-object) - 实例id
      - instanceName: string - 实例名
      - logId: integer (int64-object) - 日志id
      - orgId: integer (int32-object) - 单位id（本地部署）
      - sharded: boolean (boolean-object) - 是否为水平分表
      - snapshotId: string - 快照id
      - successCount: integer (int64-object) - 成功条数
      - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
      - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
          - curBatch: integer (int64-object) - 当前同步批次
          - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - failCount: integer (int64-object) - 失败条数
          - filterCnt: integer (int64-object) - 过滤条数
          - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - successCount: integer (int64-object) - 成功条数
          - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
          - tableDataCount: integer (int64-object) - 当前表总数据量
          - tableName: string - 表名
          - totalBatchCount: integer (int64-object) - 同步总批次
      - totalCount: integer (int64-object) - 同步总条数
  - msg: string - 异常结果返回值

#### POST /teapot/etl/listBySnapshotIds
- summary: 批量获取全量同步快照
- operationId: listBySnapshotIds
- tags: 全量同步

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.query.EtlSnapShotQuery
  - instanceIdList: array<integer (int64-object)> - 同步实例id（传此参数获取某个实例最新的快照信息）
    - items: integer (int64-object)
  - snapshotIdList: array<string> - 快照id（传此参数批量获取快照信息）
    - items: string

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EtlProgressSnapshot
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>
      - consoleLog: string - 控制台日志
      - failCount: integer (int64-object) - 失败条数
      - filterCnt: integer (int64-object) - 过滤条数
      - instanceId: integer (int64-object) - 实例id
      - instanceName: string - 实例名
      - logId: integer (int64-object) - 日志id
      - orgId: integer (int32-object) - 单位id（本地部署）
      - sharded: boolean (boolean-object) - 是否为水平分表
      - snapshotId: string - 快照id
      - successCount: integer (int64-object) - 成功条数
      - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
      - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
          - curBatch: integer (int64-object) - 当前同步批次
          - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - failCount: integer (int64-object) - 失败条数
          - filterCnt: integer (int64-object) - 过滤条数
          - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - successCount: integer (int64-object) - 成功条数
          - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
          - tableDataCount: integer (int64-object) - 当前表总数据量
          - tableName: string - 表名
          - totalBatchCount: integer (int64-object) - 同步总批次
      - totalCount: integer (int64-object) - 同步总条数
  - msg: string - 异常结果返回值

#### POST /teapot/etl/startEtl
- summary: 开启全量同步任务
- operationId: startEtl
- tags: 全量同步

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.adapter.core.param.etl.EtlSyncParam
  - conditionsContent: string - 条件内容
  - conditionsType: integer (int32-object) - 条件类型 1 sql过滤，2etl过滤
  - esAliasParam: ref<com.ruijing.sync.adapter.core.param.etl.EsAliasParam> - 更新索引别名操作
    - (value): object
  - instanceId: integer (int64-object) - 实例id
  - orgId: integer (int32-object) - 单位id（本地部署全量同步传）
  - params: array<object> - ETL条件
    - items: object
      - (value): object
  - snapshotId: string - 快照id

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.EtlInfoVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.EtlInfoVO> - 返回结果数据
    - callSuccess: boolean (boolean-object) - 是否调用成功
    - errMsg: string - 错误信息
    - snapshotId: string - 快照信息id，成功时才有
  - msg: string - 异常结果返回值

#### POST /teapot/instance/support/canalInstanceStatistic
- summary: 查询实例统计信息
- operationId: canalInstanceStatistic
- tags: 实例支持业务新建

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.param.CanalInstanceStatisticRequest
  - env: string - 环境 prod dev

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.String
  - code: integer (int32) - 结果返回状态码
  - data: string - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/instance/support/createCanalInstance
- summary: 根据同步实例创建canal实例
- operationId: createCanalInstance
- tags: 实例支持业务新建
- description: * 1. 单表单canal实例情况， 每个实例可能有1-n个表，会校验每个表是否已有canal实例存在，有则不建立 * 2. 多表组合canal实例情况（主要用于本地部署），实例所属数据源需一致，若需要组合的表，其中已经有某些表存在canal实例，则剩余表组合建立canal实例 * 3. bindTopic 开关用于绑定binlog推送的topic，理论上，无论是单表单实例还是多表组合实例情况，都是一个表一个topic，格式为canal_库名_表名_环境

##### Request
- arg1 (body), required: False
  - schema: com.ruijing.sync.common.param.CreateCanalInstanceParam
  - bindTopic: boolean - 是否绑定canal实例推送binlog的topic(默认true)
  - instanceId: integer (int64-object) - 同步实例id
  - instanceIdList: array<integer (int64-object)> - 实例ids
    - items: integer (int64-object)
  - localDeploy: boolean - 是否未本地部署创建canal实例(默认false)
  - singleTable: boolean - 是否单表单canal实例(默认false)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.CanalInstanceCreateVO
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.CanalInstanceCreateVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.CanalInstanceCreateVO>
      - canalInstanceId: string - canal实例id
      - canalInstanceName: string - canal实例名
      - createCanalInstanceSuccess: boolean - canal实例是否创建成功
      - createInstanceFailReason: string - canal实例创建失败原因
      - createTopicFailReason: string - topic创建失败原因
      - createTopicSuccess: boolean - topic是否创建成功
      - dbName: string - 需要创建canal实例的数据库名
      - existCanalInstanceTableNameList: array<string> - canal实例已经存在的表名
        - items: string
      - syncInstanceIdStr: string - 涉及同步实例id
      - tableNameList: array<string> - 创建了canal实例的表名
        - items: string
      - tableTopicMap: object - canal实例各表对应topic
        - additionalProperties: string
  - msg: string - 异常结果返回值

#### POST /teapot/instance/support/localDeploy/orgSubscribeExcel
- summary: 实例单位订阅详细信息excel
- operationId: orgSubscribeExcel
- tags: 实例支持业务新建

##### Request
- (no parameters)

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.String
  - code: integer (int32) - 结果返回状态码
  - data: string - 返回结果数据
  - msg: string - 异常结果返回值

#### POST /teapot/nonToken/doInstanceCopy
- summary: 执行实例复制的整个流程（用于配合/instance/copy接口，仅用于该接口进行http请求）
- operationId: doInstanceCopy
- tags: 开放无需token调用的接口

##### Request
- arg0 (body), required: False
  - schema: com.ruijing.sync.common.param.SyncInstanceFullCopyParam
  - copyParam: ref<com.ruijing.sync.common.param.SyncInstanceCopyParam> - 原始实例复制请求
    - env: string - 环境 prod, test
    - id: integer (int64-object) - 实例id
    - instanceName: string - 指定新实例的名字，可为空
    - sameDsId: integer (int64-object) - 所有表都在同一个数据源情况，无需给表名和数据源id对应关系
    - tableNameDsIdMap: object - 跨环境复制实例-数据源已存在，复用情况
      - additionalProperties: integer (int64-object)
    - tableNameDsInfoParamList: array<ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>> - 跨环境迁移，补全表对应的数据源信息
      - items: ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>
        - dsInfoParam: ref<com.ruijing.sync.common.param.DsInfoParam> - 实例中表对应的数据源信息（一般来说只有一个）
          - id: integer (int64-object) - id
          - name: string - 数据源名
          - password: string - 密码
          - properties: object - 额外信息
            - (value): object - 额外信息
          - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
          - url: string - 数据源连接url
          - userName: string - 用户名
        - tableNameList: array<string> - 实例的表
          - items: string
  - esTableItemRequestDTO: ref<com.ruijing.sync.common.dto.EsTableItemRequestDTO> - es类型表映射新增入参
    - instanceId: integer (int64-object) - 所属实例id
    - mappingId: integer (int64-object) - 所属映射关系id
    - tableItemList: array<ref<com.ruijing.sync.common.dto.EsTableItemRequestDTO.EsTableItemDTO>> - 表映射关系
      - items: ref<com.ruijing.sync.common.dto.EsTableItemRequestDTO.EsTableItemDTO>
        - dbName: string - dbName
        - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
        - esColumnItemRequestDTO: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO> - es类型列映射新增入参
          - columnItemList: array<ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>> - 列映射信息
            - items: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>
              - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
              - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
              - foreignKey: boolean (boolean-object) - 是否为主表外键
              - mainTableFk: string - 子表对应主表外键列名
              - needData: boolean (boolean-object) - 是否需要该数据
              - primaryKey: boolean (boolean-object) - 是否为主键
              - srcColumnName: string - 源表字段名
              - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
              - targetColumnName: string - 映射到目标字段名
              - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 所属表id
        - master: boolean (boolean-object) - 是否主表
        - nestedKey: string - es的nested字段名
        - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
        - primaryKey: string - 当前表主键，用于构造update语句
        - shardedCount: integer (int32-object) - 水平分表的分片数
        - srcDsId: integer (int64-object) - 表所属数据源id
        - tableItemId: integer (int64-object) - id
        - tableName: string - tableName
        - tableNameRegex: string - 表名正则（表被水平拆分时）
        - topic: string - 表对应的topic(topic未指定默认取表名)
        - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
        - updateTimeColumnName: string - 标识更新时间的字段名
  - rdbTableItemRequestDTO: ref<com.ruijing.sync.common.dto.RdbTableItemRequestDTO> - rdb类型表映射新增入参
    - instanceId: integer (int64-object) - 所属实例id
    - mappingId: integer (int64-object) - 所属映射关系id
    - tableItemList: array<ref<com.ruijing.sync.common.dto.RdbTableItemRequestDTO.RdbTableItemDTO>> - 表映射关系
      - items: ref<com.ruijing.sync.common.dto.RdbTableItemRequestDTO.RdbTableItemDTO>
        - dbName: string - dbName
        - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
        - master: boolean (boolean-object) - 是否主表
        - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
        - orgIdColumnName: string - orgId字段名称
        - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
        - primaryKey: string - 当前表主键，用于构造update语句
        - rdbColumnItemRequestDTO: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO> - rdb类型列映射新增入参
          - columnItemList: array<ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>> - 列映射信息
            - items: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>
              - foreignKey: boolean (boolean-object) - 是否为主表外键
              - mainTableFk: string - 子表对应主表外键列名
              - needData: boolean (boolean-object) - 是否需要该数据
              - primaryKey: boolean (boolean-object) - 是否为主键
              - srcColumnName: string - 源表字段名
              - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
              - targetColumnName: string - 映射到目标字段名
              - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 所属表id
        - srcDsId: integer (int64-object) - 表所属数据源id
        - tableName: string - tableName
        - targetPrimaryKey: string - 目标表主键，用于构造update语句
        - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
        - topic: string - 表对应的topic(topic未指定默认取表名)
        - updateTimeColumnName: string - 标识更新时间的字段名
  - srcInstanceVO: ref<com.ruijing.sync.common.vo.SyncInstanceVO> - 需要复制的实例信息
    - createTime: string (date) - 创建时间
    - createUserGuid: string - 创建人guid
    - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - mappingId: integer (int64-object) - 映射关系Id
    - mappingJson: object - 映射关系json
      - (value): object - 映射关系json
    - pushType: integer (int32-object) - 实例目标端推送数据方式
    - srcDsIdList: string - 源数据库id数组
    - srcTableName: string - 源数据表名
    - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
    - targetTableName: string - 目标表/索引名
    - team: string - 同步实例所属团队
    - topicList: string - mq的topic
    - updateTime: string (date) - 更新时间
  - syncInstanceParam: ref<com.ruijing.sync.common.param.SyncInstanceParam> - 同步实例基础信息及mapping信息入参
    - clickhouseMappingParam: ref<com.ruijing.sync.common.param.ClickhouseMappingParam> - clickhouse同步类型的额外参数,syncType为 3 时传
      - (value): object
    - createUserGuid: string - 创建人guid
    - esMappingParam: ref<com.ruijing.sync.common.param.EsMappingParam> - es同步类型的额外参数,syncType为 2 时传
      - esIndexId: string - es主键字段名
      - etlCondition: string - 全量同步额外条件
      - indexName: string - 索引名
      - methodMappings: object - 计算值映射关系
        - (value): object - 计算值映射关系
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - rdbMappingParam: ref<com.ruijing.sync.common.param.RdbMappingParam> - rdb同步类型的额外参数,syncType为 1 时传
      - etlCondition: string - 全量同步额外条件
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es 3 clickhouse
    - team: string - 同步实例所属团队
  - team: string - 实例复制需要路由转发的服务分组

##### Response
- 200: successful operation
  - schema: com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.SyncInstanceVO
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.SyncInstanceVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - createUserGuid: string - 创建人guid
    - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - mappingId: integer (int64-object) - 映射关系Id
    - mappingJson: object - 映射关系json
      - (value): object - 映射关系json
    - pushType: integer (int32-object) - 实例目标端推送数据方式
    - srcDsIdList: string - 源数据库id数组
    - srcTableName: string - 源数据表名
    - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
    - targetTableName: string - 目标表/索引名
    - team: string - 同步实例所属团队
    - topicList: string - mq的topic
    - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### POST /teapot/ping
- summary: syncTypeDict
- operationId: syncTypeDict
- tags: PingController

##### Request
- (no parameters)

##### Response
- 200: successful operation
  - schema: string
  - (value): string

### Schemas

#### com.ruijing.fundamental.api.remote.RemoteResponse
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: object - 返回结果数据
    - (value): object - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.EtlInfoVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.EtlInfoVO> - 返回结果数据
    - callSuccess: boolean (boolean-object) - 是否调用成功
    - errMsg: string - 错误信息
    - snapshotId: string - 快照信息id，成功时才有
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsecom.ruijing.sync.common.vo.SyncInstanceVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: ref<com.ruijing.sync.common.vo.SyncInstanceVO> - 返回结果数据
    - createTime: string (date) - 创建时间
    - createUserGuid: string - 创建人guid
    - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - mappingId: integer (int64-object) - 映射关系Id
    - mappingJson: object - 映射关系json
      - (value): object - 映射关系json
    - pushType: integer (int32-object) - 实例目标端推送数据方式
    - srcDsIdList: string - 源数据库id数组
    - srcTableName: string - 源数据表名
    - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
    - targetTableName: string - 目标表/索引名
    - team: string - 同步实例所属团队
    - topicList: string - mq的topic
    - updateTime: string (date) - 更新时间
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.Boolean
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: boolean (boolean-object) - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.lang.String
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: string - 返回结果数据
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.CanalInstanceCreateVO
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.CanalInstanceCreateVO>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.CanalInstanceCreateVO>
      - canalInstanceId: string - canal实例id
      - canalInstanceName: string - canal实例名
      - createCanalInstanceSuccess: boolean - canal实例是否创建成功
      - createInstanceFailReason: string - canal实例创建失败原因
      - createTopicFailReason: string - topic创建失败原因
      - createTopicSuccess: boolean - topic是否创建成功
      - dbName: string - 需要创建canal实例的数据库名
      - existCanalInstanceTableNameList: array<string> - canal实例已经存在的表名
        - items: string
      - syncInstanceIdStr: string - 涉及同步实例id
      - tableNameList: array<string> - 创建了canal实例的表名
        - items: string
      - tableTopicMap: object - canal实例各表对应topic
        - additionalProperties: string
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer>
      - key: string
      - val: integer (int32-object)
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Long
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Long>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Long>
      - key: string
      - val: integer (int64-object)
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.String
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.String>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.String>
      - key: string
      - val: string
  - msg: string - 异常结果返回值

#### com.ruijing.fundamental.api.remote.RemoteResponsejava.util.Listcom.ruijing.sync.common.vo.EtlProgressSnapshot
- structure:
  - code: integer (int32) - 结果返回状态码
  - data: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>> - 返回结果数据
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot>
      - consoleLog: string - 控制台日志
      - failCount: integer (int64-object) - 失败条数
      - filterCnt: integer (int64-object) - 过滤条数
      - instanceId: integer (int64-object) - 实例id
      - instanceName: string - 实例名
      - logId: integer (int64-object) - 日志id
      - orgId: integer (int32-object) - 单位id（本地部署）
      - sharded: boolean (boolean-object) - 是否为水平分表
      - snapshotId: string - 快照id
      - successCount: integer (int64-object) - 成功条数
      - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
      - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
          - curBatch: integer (int64-object) - 当前同步批次
          - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - failCount: integer (int64-object) - 失败条数
          - filterCnt: integer (int64-object) - 过滤条数
          - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
            - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
              - batchId: integer (int64-object) - 批次id
              - batchSize: integer (int64-object) - 当前批次同步数量
              - maxDataId: integer (int64-object) - 当前批次最大id
              - minDataId: integer (int64-object) - 当前批次起始id
          - successCount: integer (int64-object) - 成功条数
          - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
          - tableDataCount: integer (int64-object) - 当前表总数据量
          - tableName: string - 表名
          - totalBatchCount: integer (int64-object) - 同步总批次
      - totalCount: integer (int64-object) - 同步总条数
  - msg: string - 异常结果返回值

#### com.ruijing.sync.adapter.core.param.etl.EsAliasParam
- structure:
  - (value): object

#### com.ruijing.sync.adapter.core.param.etl.EtlSyncParam
- structure:
  - conditionsContent: string - 条件内容
  - conditionsType: integer (int32-object) - 条件类型 1 sql过滤，2etl过滤
  - esAliasParam: ref<com.ruijing.sync.adapter.core.param.etl.EsAliasParam> - 更新索引别名操作
    - (value): object
  - instanceId: integer (int64-object) - 实例id
  - orgId: integer (int32-object) - 单位id（本地部署全量同步传）
  - params: array<object> - ETL条件
    - items: object
      - (value): object
  - snapshotId: string - 快照id

#### com.ruijing.sync.common.dto.EsColumnItemRequestDTO
- structure:
  - columnItemList: array<ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>> - 列映射信息
    - items: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>
      - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
      - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 所属表id

#### com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO
- structure:
  - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
  - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.common.dto.EsTableItemRequestDTO
- structure:
  - instanceId: integer (int64-object) - 所属实例id
  - mappingId: integer (int64-object) - 所属映射关系id
  - tableItemList: array<ref<com.ruijing.sync.common.dto.EsTableItemRequestDTO.EsTableItemDTO>> - 表映射关系
    - items: ref<com.ruijing.sync.common.dto.EsTableItemRequestDTO.EsTableItemDTO>
      - dbName: string - dbName
      - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
      - esColumnItemRequestDTO: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO> - es类型列映射新增入参
        - columnItemList: array<ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>> - 列映射信息
          - items: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>
            - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
            - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
            - foreignKey: boolean (boolean-object) - 是否为主表外键
            - mainTableFk: string - 子表对应主表外键列名
            - needData: boolean (boolean-object) - 是否需要该数据
            - primaryKey: boolean (boolean-object) - 是否为主键
            - srcColumnName: string - 源表字段名
            - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
            - targetColumnName: string - 映射到目标字段名
            - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
        - tableItemId: integer (int64-object) - 所属表id
      - master: boolean (boolean-object) - 是否主表
      - nestedKey: string - es的nested字段名
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - shardedCount: integer (int32-object) - 水平分表的分片数
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableItemId: integer (int64-object) - id
      - tableName: string - tableName
      - tableNameRegex: string - 表名正则（表被水平拆分时）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
      - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.common.dto.EsTableItemRequestDTO.EsTableItemDTO
- structure:
  - dbName: string - dbName
  - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
  - esColumnItemRequestDTO: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO> - es类型列映射新增入参
    - columnItemList: array<ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>> - 列映射信息
      - items: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>
        - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
        - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
        - foreignKey: boolean (boolean-object) - 是否为主表外键
        - mainTableFk: string - 子表对应主表外键列名
        - needData: boolean (boolean-object) - 是否需要该数据
        - primaryKey: boolean (boolean-object) - 是否为主键
        - srcColumnName: string - 源表字段名
        - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
        - targetColumnName: string - 映射到目标字段名
        - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
    - tableItemId: integer (int64-object) - 所属表id
  - master: boolean (boolean-object) - 是否主表
  - nestedKey: string - es的nested字段名
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - shardedCount: integer (int32-object) - 水平分表的分片数
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableItemId: integer (int64-object) - id
  - tableName: string - tableName
  - tableNameRegex: string - 表名正则（表被水平拆分时）
  - topic: string - 表对应的topic(topic未指定默认取表名)
  - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.common.dto.RdbColumnItemRequestDTO
- structure:
  - columnItemList: array<ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>> - 列映射信息
    - items: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>
      - foreignKey: boolean (boolean-object) - 是否为主表外键
      - mainTableFk: string - 子表对应主表外键列名
      - needData: boolean (boolean-object) - 是否需要该数据
      - primaryKey: boolean (boolean-object) - 是否为主键
      - srcColumnName: string - 源表字段名
      - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
      - targetColumnName: string - 映射到目标字段名
      - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - tableItemId: integer (int64-object) - 所属表id

#### com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO
- structure:
  - foreignKey: boolean (boolean-object) - 是否为主表外键
  - mainTableFk: string - 子表对应主表外键列名
  - needData: boolean (boolean-object) - 是否需要该数据
  - primaryKey: boolean (boolean-object) - 是否为主键
  - srcColumnName: string - 源表字段名
  - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
  - targetColumnName: string - 映射到目标字段名
  - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String

#### com.ruijing.sync.common.dto.RdbTableItemRequestDTO
- structure:
  - instanceId: integer (int64-object) - 所属实例id
  - mappingId: integer (int64-object) - 所属映射关系id
  - tableItemList: array<ref<com.ruijing.sync.common.dto.RdbTableItemRequestDTO.RdbTableItemDTO>> - 表映射关系
    - items: ref<com.ruijing.sync.common.dto.RdbTableItemRequestDTO.RdbTableItemDTO>
      - dbName: string - dbName
      - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
      - master: boolean (boolean-object) - 是否主表
      - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
      - orgIdColumnName: string - orgId字段名称
      - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
      - primaryKey: string - 当前表主键，用于构造update语句
      - rdbColumnItemRequestDTO: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO> - rdb类型列映射新增入参
        - columnItemList: array<ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>> - 列映射信息
          - items: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>
            - foreignKey: boolean (boolean-object) - 是否为主表外键
            - mainTableFk: string - 子表对应主表外键列名
            - needData: boolean (boolean-object) - 是否需要该数据
            - primaryKey: boolean (boolean-object) - 是否为主键
            - srcColumnName: string - 源表字段名
            - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
            - targetColumnName: string - 映射到目标字段名
            - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
        - tableItemId: integer (int64-object) - 所属表id
      - srcDsId: integer (int64-object) - 表所属数据源id
      - tableName: string - tableName
      - targetPrimaryKey: string - 目标表主键，用于构造update语句
      - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
      - topic: string - 表对应的topic(topic未指定默认取表名)
      - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.common.dto.RdbTableItemRequestDTO.RdbTableItemDTO
- structure:
  - dbName: string - dbName
  - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
  - master: boolean (boolean-object) - 是否主表
  - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
  - orgIdColumnName: string - orgId字段名称
  - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
  - primaryKey: string - 当前表主键，用于构造update语句
  - rdbColumnItemRequestDTO: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO> - rdb类型列映射新增入参
    - columnItemList: array<ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>> - 列映射信息
      - items: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>
        - foreignKey: boolean (boolean-object) - 是否为主表外键
        - mainTableFk: string - 子表对应主表外键列名
        - needData: boolean (boolean-object) - 是否需要该数据
        - primaryKey: boolean (boolean-object) - 是否为主键
        - srcColumnName: string - 源表字段名
        - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
        - targetColumnName: string - 映射到目标字段名
        - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
    - tableItemId: integer (int64-object) - 所属表id
  - srcDsId: integer (int64-object) - 表所属数据源id
  - tableName: string - tableName
  - targetPrimaryKey: string - 目标表主键，用于构造update语句
  - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
  - topic: string - 表对应的topic(topic未指定默认取表名)
  - updateTimeColumnName: string - 标识更新时间的字段名

#### com.ruijing.sync.common.param.CanalInstanceStatisticRequest
- structure:
  - env: string - 环境 prod dev

#### com.ruijing.sync.common.param.ClickhouseMappingParam
- structure:
  - (value): object

#### com.ruijing.sync.common.param.CreateCanalInstanceParam
- structure:
  - bindTopic: boolean - 是否绑定canal实例推送binlog的topic(默认true)
  - instanceId: integer (int64-object) - 同步实例id
  - instanceIdList: array<integer (int64-object)> - 实例ids
    - items: integer (int64-object)
  - localDeploy: boolean - 是否未本地部署创建canal实例(默认false)
  - singleTable: boolean - 是否单表单canal实例(默认false)

#### com.ruijing.sync.common.param.DsInfoParam
- structure:
  - id: integer (int64-object) - id
  - name: string - 数据源名
  - password: string - 密码
  - properties: object - 额外信息
    - (value): object - 额外信息
  - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
  - url: string - 数据源连接url
  - userName: string - 用户名

#### com.ruijing.sync.common.param.EsMappingParam
- structure:
  - esIndexId: string - es主键字段名
  - etlCondition: string - 全量同步额外条件
  - indexName: string - 索引名
  - methodMappings: object - 计算值映射关系
    - (value): object - 计算值映射关系

#### com.ruijing.sync.common.param.RdbMappingParam
- structure:
  - etlCondition: string - 全量同步额外条件

#### com.ruijing.sync.common.param.SyncInstanceCopyParam
- structure:
  - env: string - 环境 prod, test
  - id: integer (int64-object) - 实例id
  - instanceName: string - 指定新实例的名字，可为空
  - sameDsId: integer (int64-object) - 所有表都在同一个数据源情况，无需给表名和数据源id对应关系
  - tableNameDsIdMap: object - 跨环境复制实例-数据源已存在，复用情况
    - additionalProperties: integer (int64-object)
  - tableNameDsInfoParamList: array<ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>> - 跨环境迁移，补全表对应的数据源信息
    - items: ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>
      - dsInfoParam: ref<com.ruijing.sync.common.param.DsInfoParam> - 实例中表对应的数据源信息（一般来说只有一个）
        - id: integer (int64-object) - id
        - name: string - 数据源名
        - password: string - 密码
        - properties: object - 额外信息
          - (value): object - 额外信息
        - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
        - url: string - 数据源连接url
        - userName: string - 用户名
      - tableNameList: array<string> - 实例的表
        - items: string

#### com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam
- structure:
  - dsInfoParam: ref<com.ruijing.sync.common.param.DsInfoParam> - 实例中表对应的数据源信息（一般来说只有一个）
    - id: integer (int64-object) - id
    - name: string - 数据源名
    - password: string - 密码
    - properties: object - 额外信息
      - (value): object - 额外信息
    - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
    - url: string - 数据源连接url
    - userName: string - 用户名
  - tableNameList: array<string> - 实例的表
    - items: string

#### com.ruijing.sync.common.param.SyncInstanceFullCopyParam
- structure:
  - copyParam: ref<com.ruijing.sync.common.param.SyncInstanceCopyParam> - 原始实例复制请求
    - env: string - 环境 prod, test
    - id: integer (int64-object) - 实例id
    - instanceName: string - 指定新实例的名字，可为空
    - sameDsId: integer (int64-object) - 所有表都在同一个数据源情况，无需给表名和数据源id对应关系
    - tableNameDsIdMap: object - 跨环境复制实例-数据源已存在，复用情况
      - additionalProperties: integer (int64-object)
    - tableNameDsInfoParamList: array<ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>> - 跨环境迁移，补全表对应的数据源信息
      - items: ref<com.ruijing.sync.common.param.SyncInstanceCopyParam.TableNameDsInfoParam>
        - dsInfoParam: ref<com.ruijing.sync.common.param.DsInfoParam> - 实例中表对应的数据源信息（一般来说只有一个）
          - id: integer (int64-object) - id
          - name: string - 数据源名
          - password: string - 密码
          - properties: object - 额外信息
            - (value): object - 额外信息
          - type: integer (int32-object) - 数据源类型 1 mysql 2 es ...
          - url: string - 数据源连接url
          - userName: string - 用户名
        - tableNameList: array<string> - 实例的表
          - items: string
  - esTableItemRequestDTO: ref<com.ruijing.sync.common.dto.EsTableItemRequestDTO> - es类型表映射新增入参
    - instanceId: integer (int64-object) - 所属实例id
    - mappingId: integer (int64-object) - 所属映射关系id
    - tableItemList: array<ref<com.ruijing.sync.common.dto.EsTableItemRequestDTO.EsTableItemDTO>> - 表映射关系
      - items: ref<com.ruijing.sync.common.dto.EsTableItemRequestDTO.EsTableItemDTO>
        - dbName: string - dbName
        - delimiter: string - 连接符，如果array的item来源为多个表字段的拼接的话
        - esColumnItemRequestDTO: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO> - es类型列映射新增入参
          - columnItemList: array<ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>> - 列映射信息
            - items: ref<com.ruijing.sync.common.dto.EsColumnItemRequestDTO.EsColumnItemDTO>
              - columnSql: string - 从表字段的查询sql，如该字段为concat(column1,column2)
              - delimiter: string - 字段分隔符，分割字段内容如orgId1,orgId2,OrgId3的数据
              - foreignKey: boolean (boolean-object) - 是否为主表外键
              - mainTableFk: string - 子表对应主表外键列名
              - needData: boolean (boolean-object) - 是否需要该数据
              - primaryKey: boolean (boolean-object) - 是否为主键
              - srcColumnName: string - 源表字段名
              - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
              - targetColumnName: string - 映射到目标字段名
              - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 所属表id
        - master: boolean (boolean-object) - 是否主表
        - nestedKey: string - es的nested字段名
        - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
        - primaryKey: string - 当前表主键，用于构造update语句
        - shardedCount: integer (int32-object) - 水平分表的分片数
        - srcDsId: integer (int64-object) - 表所属数据源id
        - tableItemId: integer (int64-object) - id
        - tableName: string - tableName
        - tableNameRegex: string - 表名正则（表被水平拆分时）
        - topic: string - 表对应的topic(topic未指定默认取表名)
        - type: integer (int32-object) - 映射类型 1 普通field，2 nested，3 array，4 复杂计算值
        - updateTimeColumnName: string - 标识更新时间的字段名
  - rdbTableItemRequestDTO: ref<com.ruijing.sync.common.dto.RdbTableItemRequestDTO> - rdb类型表映射新增入参
    - instanceId: integer (int64-object) - 所属实例id
    - mappingId: integer (int64-object) - 所属映射关系id
    - tableItemList: array<ref<com.ruijing.sync.common.dto.RdbTableItemRequestDTO.RdbTableItemDTO>> - 表映射关系
      - items: ref<com.ruijing.sync.common.dto.RdbTableItemRequestDTO.RdbTableItemDTO>
        - dbName: string - dbName
        - mappingAll: boolean (boolean-object) - 是否映射所有字段 全部映射 默认部分映射 源表目标表一对一且字段及数据类型完全一致
        - master: boolean (boolean-object) - 是否主表
        - needSync: boolean (boolean-object) - 是否需要被同步(为从表时), 默认需要
        - orgIdColumnName: string - orgId字段名称
        - otherCondition: string - 查询从表数据时,除了关联主表外键,还有额外的查询条件
        - primaryKey: string - 当前表主键，用于构造update语句
        - rdbColumnItemRequestDTO: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO> - rdb类型列映射新增入参
          - columnItemList: array<ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>> - 列映射信息
            - items: ref<com.ruijing.sync.common.dto.RdbColumnItemRequestDTO.RdbColumnItemDTO>
              - foreignKey: boolean (boolean-object) - 是否为主表外键
              - mainTableFk: string - 子表对应主表外键列名
              - needData: boolean (boolean-object) - 是否需要该数据
              - primaryKey: boolean (boolean-object) - 是否为主键
              - srcColumnName: string - 源表字段名
              - srcDataType: integer (int32-object) - 源端字段数据类型，枚举值如 1 Integer 2 Long 3 String
              - targetColumnName: string - 映射到目标字段名
              - targetDataType: integer (int32-object) - 目标字段数据类型，枚举值如 1 Integer 2 Long 3 String
          - tableItemId: integer (int64-object) - 所属表id
        - srcDsId: integer (int64-object) - 表所属数据源id
        - tableName: string - tableName
        - targetPrimaryKey: string - 目标表主键，用于构造update语句
        - targetTableName: string - 目标表名（mappingAll=1时，为一对一表，不需要columnMappings）
        - topic: string - 表对应的topic(topic未指定默认取表名)
        - updateTimeColumnName: string - 标识更新时间的字段名
  - srcInstanceVO: ref<com.ruijing.sync.common.vo.SyncInstanceVO> - 需要复制的实例信息
    - createTime: string (date) - 创建时间
    - createUserGuid: string - 创建人guid
    - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - mappingId: integer (int64-object) - 映射关系Id
    - mappingJson: object - 映射关系json
      - (value): object - 映射关系json
    - pushType: integer (int32-object) - 实例目标端推送数据方式
    - srcDsIdList: string - 源数据库id数组
    - srcTableName: string - 源数据表名
    - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
    - targetTableName: string - 目标表/索引名
    - team: string - 同步实例所属团队
    - topicList: string - mq的topic
    - updateTime: string (date) - 更新时间
  - syncInstanceParam: ref<com.ruijing.sync.common.param.SyncInstanceParam> - 同步实例基础信息及mapping信息入参
    - clickhouseMappingParam: ref<com.ruijing.sync.common.param.ClickhouseMappingParam> - clickhouse同步类型的额外参数,syncType为 3 时传
      - (value): object
    - createUserGuid: string - 创建人guid
    - esMappingParam: ref<com.ruijing.sync.common.param.EsMappingParam> - es同步类型的额外参数,syncType为 2 时传
      - esIndexId: string - es主键字段名
      - etlCondition: string - 全量同步额外条件
      - indexName: string - 索引名
      - methodMappings: object - 计算值映射关系
        - (value): object - 计算值映射关系
    - id: integer (int64-object) - id
    - instanceName: string - 任务实例名
    - rdbMappingParam: ref<com.ruijing.sync.common.param.RdbMappingParam> - rdb同步类型的额外参数,syncType为 1 时传
      - etlCondition: string - 全量同步额外条件
    - syncType: integer (int32-object) - 同步类型 1 rdb 2 es 3 clickhouse
    - team: string - 同步实例所属团队
  - team: string - 实例复制需要路由转发的服务分组

#### com.ruijing.sync.common.param.SyncInstanceParam
- structure:
  - clickhouseMappingParam: ref<com.ruijing.sync.common.param.ClickhouseMappingParam> - clickhouse同步类型的额外参数,syncType为 3 时传
    - (value): object
  - createUserGuid: string - 创建人guid
  - esMappingParam: ref<com.ruijing.sync.common.param.EsMappingParam> - es同步类型的额外参数,syncType为 2 时传
    - esIndexId: string - es主键字段名
    - etlCondition: string - 全量同步额外条件
    - indexName: string - 索引名
    - methodMappings: object - 计算值映射关系
      - (value): object - 计算值映射关系
  - id: integer (int64-object) - id
  - instanceName: string - 任务实例名
  - rdbMappingParam: ref<com.ruijing.sync.common.param.RdbMappingParam> - rdb同步类型的额外参数,syncType为 1 时传
    - etlCondition: string - 全量同步额外条件
  - syncType: integer (int32-object) - 同步类型 1 rdb 2 es 3 clickhouse
  - team: string - 同步实例所属团队

#### com.ruijing.sync.common.query.EtlSnapShotQuery
- structure:
  - instanceIdList: array<integer (int64-object)> - 同步实例id（传此参数获取某个实例最新的快照信息）
    - items: integer (int64-object)
  - snapshotIdList: array<string> - 快照id（传此参数批量获取快照信息）
    - items: string

#### com.ruijing.sync.common.vo.CanalInstanceCreateVO
- structure:
  - canalInstanceId: string - canal实例id
  - canalInstanceName: string - canal实例名
  - createCanalInstanceSuccess: boolean - canal实例是否创建成功
  - createInstanceFailReason: string - canal实例创建失败原因
  - createTopicFailReason: string - topic创建失败原因
  - createTopicSuccess: boolean - topic是否创建成功
  - dbName: string - 需要创建canal实例的数据库名
  - existCanalInstanceTableNameList: array<string> - canal实例已经存在的表名
    - items: string
  - syncInstanceIdStr: string - 涉及同步实例id
  - tableNameList: array<string> - 创建了canal实例的表名
    - items: string
  - tableTopicMap: object - canal实例各表对应topic
    - additionalProperties: string

#### com.ruijing.sync.common.vo.EnumItemVO
- structure:
  - key: object
    - (value): object
  - val: object
    - (value): object

#### com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Integer
- structure:
  - key: string
  - val: integer (int32-object)

#### com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.Long
- structure:
  - key: string
  - val: integer (int64-object)

#### com.ruijing.sync.common.vo.EnumItemVOjava.lang.Stringjava.lang.String
- structure:
  - key: string
  - val: string

#### com.ruijing.sync.common.vo.EtlInfoVO
- structure:
  - callSuccess: boolean (boolean-object) - 是否调用成功
  - errMsg: string - 错误信息
  - snapshotId: string - 快照信息id，成功时才有

#### com.ruijing.sync.common.vo.EtlProgressSnapshot
- structure:
  - consoleLog: string - 控制台日志
  - failCount: integer (int64-object) - 失败条数
  - filterCnt: integer (int64-object) - 过滤条数
  - instanceId: integer (int64-object) - 实例id
  - instanceName: string - 实例名
  - logId: integer (int64-object) - 日志id
  - orgId: integer (int32-object) - 单位id（本地部署）
  - sharded: boolean (boolean-object) - 是否为水平分表
  - snapshotId: string - 快照id
  - successCount: integer (int64-object) - 成功条数
  - syncFinished: boolean (boolean-object) - 同步状态（全部全部表是否同步完成）
  - tableInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>> - 同步表信息
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo>
      - curBatch: integer (int64-object) - 当前同步批次
      - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
          - batchId: integer (int64-object) - 批次id
          - batchSize: integer (int64-object) - 当前批次同步数量
          - maxDataId: integer (int64-object) - 当前批次最大id
          - minDataId: integer (int64-object) - 当前批次起始id
      - failCount: integer (int64-object) - 失败条数
      - filterCnt: integer (int64-object) - 过滤条数
      - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
        - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
          - batchId: integer (int64-object) - 批次id
          - batchSize: integer (int64-object) - 当前批次同步数量
          - maxDataId: integer (int64-object) - 当前批次最大id
          - minDataId: integer (int64-object) - 当前批次起始id
      - successCount: integer (int64-object) - 成功条数
      - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
      - tableDataCount: integer (int64-object) - 当前表总数据量
      - tableName: string - 表名
      - totalBatchCount: integer (int64-object) - 同步总批次
  - totalCount: integer (int64-object) - 同步总条数

#### com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo
- structure:
  - batchId: integer (int64-object) - 批次id
  - batchSize: integer (int64-object) - 当前批次同步数量
  - maxDataId: integer (int64-object) - 当前批次最大id
  - minDataId: integer (int64-object) - 当前批次起始id

#### com.ruijing.sync.common.vo.EtlProgressSnapshot.TableSyncInfo
- structure:
  - curBatch: integer (int64-object) - 当前同步批次
  - failBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 失败的批次
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
      - batchId: integer (int64-object) - 批次id
      - batchSize: integer (int64-object) - 当前批次同步数量
      - maxDataId: integer (int64-object) - 当前批次最大id
      - minDataId: integer (int64-object) - 当前批次起始id
  - failCount: integer (int64-object) - 失败条数
  - filterCnt: integer (int64-object) - 过滤条数
  - finishBatchInfoList: array<ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>> - 已完成的批次
    - items: ref<com.ruijing.sync.common.vo.EtlProgressSnapshot.BatchInfo>
      - batchId: integer (int64-object) - 批次id
      - batchSize: integer (int64-object) - 当前批次同步数量
      - maxDataId: integer (int64-object) - 当前批次最大id
      - minDataId: integer (int64-object) - 当前批次起始id
  - successCount: integer (int64-object) - 成功条数
  - syncFinished: boolean (boolean-object) - 同步状态（全部同步批次是否执行完）
  - tableDataCount: integer (int64-object) - 当前表总数据量
  - tableName: string - 表名
  - totalBatchCount: integer (int64-object) - 同步总批次

#### com.ruijing.sync.common.vo.SyncInstanceVO
- structure:
  - createTime: string (date) - 创建时间
  - createUserGuid: string - 创建人guid
  - enableLog: integer (int32-object) - 是否开启日志（1开启 0关闭）
  - id: integer (int64-object) - id
  - instanceName: string - 任务实例名
  - mappingId: integer (int64-object) - 映射关系Id
  - mappingJson: object - 映射关系json
    - (value): object - 映射关系json
  - pushType: integer (int32-object) - 实例目标端推送数据方式
  - srcDsIdList: string - 源数据库id数组
  - srcTableName: string - 源数据表名
  - status: integer (int32-object) - 实例状态 0 草稿 1 启用 2禁用
  - syncType: integer (int32-object) - 同步类型 1 rdb 2 es
  - targetTableName: string - 目标表/索引名
  - team: string - 同步实例所属团队
  - topicList: string - mq的topic
  - updateTime: string (date) - 更新时间

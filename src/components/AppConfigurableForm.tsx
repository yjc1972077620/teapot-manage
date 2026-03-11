import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, InputNumber, Radio, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

/**
 * 字段类型类
 * 使用静态属性定义所有可能的字段类型
 */
export class FieldType {
  // 字符串字面量类型对应的静态属性
  static TEXT = 'text';
  static NUMBER = 'number';
  static SELECT = 'select';
  static TEXTAREA = 'textarea';
  static PASSWORD = 'password';
  static CHECKBOX = 'checkbox';
  static RADIO = 'radio';
}

/**
 * 数据类型类
 * 使用静态属性定义所有可能的数据类型
 */
export class DataType {
  // 字符串字面量类型对应的静态属性
  static STRING = 'string';
  static NUMBER = 'number';
  static BOOLEAN = 'boolean';
  static DATE = 'date';
  static ARRAY = 'array';
  static OBJECT = 'object';
}

/**
 * 按钮配置类
 */
export class ButtonConfig {
  text: React.ReactNode;
  show: boolean;
  icon?: string;
  onClick?: (e: React.SyntheticEvent, formData?: Record<string, any>) => void;
  props?: Record<string, any>;

  /**
   * 构造函数
   * @param config 按钮配置对象
   */
  constructor(config: {
    text: React.ReactNode;
    show: boolean;
    icon?: string;
    onClick?: (e: React.SyntheticEvent, formData?: Record<string, any>) => void;
    props?: Record<string, any>;
  }) {
    this.text = config.text;
    this.show = config.show;
    this.icon = config.icon;
    this.onClick = config.onClick;
    this.props = config.props;
  }
}

/**
 * 字段配置类
 */
export class FieldConfig {
  name: string;           // 字段名，支持嵌套路径如 'user.info.name'
  label: string;          // 字段标签
  type: string;           // 字段类型，使用FieldType类的静态属性
  dataType?: string;      // 数据类型，使用DataType类的静态属性，默认为STRING
  placeholder?: string;   // 占位符文本
  required?: boolean;     // 是否必填
  disabled?: boolean;     // 是否禁用
  defaultValue?: any;     // 默认值
  options?: any[] | string; // 选项列表或选项数据键名
  hidden?: boolean;       // 是否隐藏
  tips?: string;          // 提示信息
  validateRule?: RegExp;  // 验证规则
  validateMessage?: string; // 验证失败提示信息
  componentProps?: Record<string, any>; // 附加到表单组件的属性
  dictData?: Record<string, any>; // 字段特定的数据字典，如下拉框选项数据
  customRender?: (field: FieldConfig, value: any, onChange: (value: any) => void) => React.ReactNode; // 自定义渲染函数
  onFieldChange?: (fieldName: string, value: any, formData: Record<string, any>) => void; // 字段变更回调函数

  /**
   * 构造函数
   * @param config 字段配置对象
   */
  constructor(config: Partial<FieldConfig>) {
    // 初始化必需字段
    this.name = config.name || '';
    this.label = config.label || '';
    this.type = config.type || 'text';
    this.dataType = config.dataType || DataType.STRING; // 设置默认数据类型为字符串

    // 初始化可选字段
    this.placeholder = config.placeholder;
    this.required = config.required || false;
    this.disabled = config.disabled || false;
    this.defaultValue = config.defaultValue;
    this.options = config.options;
    this.hidden = config.hidden || false;
    this.tips = config.tips;
    this.validateRule = config.validateRule;
    this.validateMessage = config.validateMessage;
    this.componentProps = config.componentProps;
    this.dictData = config.dictData;
    this.customRender = config.customRender;
    this.onFieldChange = config.onFieldChange;
  }

  /**
   * 设置必填规则
   * @param isRequired 是否必填
   * @param message 验证失败提示信息
   * @returns 当前字段配置实例
   */
  setRequired(isRequired: boolean = true, message?: string): FieldConfig {
    this.required = isRequired;
    if (message) {
      this.validateMessage = message;
    }
    return this;
  }

  /**
   * 设置禁用状态
   * @param isDisabled 是否禁用
   * @returns 当前字段配置实例
   */
  setDisabled(isDisabled: boolean = true): FieldConfig {
    this.disabled = isDisabled;
    return this;
  }

  /**
   * 设置验证规则
   * @param rule 验证正则表达式
   * @param message 验证失败提示信息
   * @returns 当前字段配置实例
   */
  setValidateRule(rule: RegExp, message: string): FieldConfig {
    this.validateRule = rule;
    this.validateMessage = message;
    return this;
  }

  /**
   * 设置提示信息
   * @param tips 提示文本
   * @returns 当前字段配置实例
   */
  setTips(tips: string): FieldConfig {
    this.tips = tips;
    return this;
  }

  /**
   * 设置字段数据字典
   * @param dictData 数据字典对象
   * @returns 当前字段配置实例
   */
  setDictData(dictData: Record<string, any>): FieldConfig {
    this.dictData = dictData;
    return this;
  }

  /**
   * 设置自定义渲染函数
   * @param renderFunc 自定义渲染函数
   * @returns 当前字段配置实例
   */
  setCustomRender(renderFunc: (field: FieldConfig, value: any, onChange: (value: any) => void) => React.ReactNode): FieldConfig {
    this.customRender = renderFunc;
    return this;
  }

  /**
   * 设置字段变更回调函数
   * @param callback 字段变更回调函数
   * @returns 当前字段配置实例
   */
  setFieldChangeCallback(callback: (fieldName: string, value: any, formData: Record<string, any>) => void): FieldConfig {
    this.onFieldChange = callback;
    return this;
  }
}

/**
 * 布局配置类
 */
export class LayoutConfig {
  fieldsPerRow: number;   // 每行显示的字段数
  labelWidth?: string;    // 标签宽度
  fieldWidth?: string;    // 字段宽度
  spacing?: string;       // 字段间距
  layoutType?: 'grid' | 'flex' | 'vertical'; // 布局类型
  align?: 'left' | 'center' | 'right'; // 对齐方式

  /**
   * 构造函数
   * @param config 布局配置对象
   */
  constructor(config?: Partial<LayoutConfig>) {
    this.fieldsPerRow = config?.fieldsPerRow || 2;
    this.labelWidth = config?.labelWidth || '120px';
    this.fieldWidth = config?.fieldWidth;
    this.spacing = config?.spacing || '16px';
    this.layoutType = config?.layoutType || 'grid';
    this.align = config?.align || 'left';
  }

  /**
   * 设置每行显示的字段数
   * @param count 字段数
   * @returns 当前布局配置实例
   */
  setFieldsPerRow(count: number): LayoutConfig {
    this.fieldsPerRow = count;
    return this;
  }

  /**
   * 设置标签宽度
   * @param width 宽度值
   * @returns 当前布局配置实例
   */
  setLabelWidth(width: string): LayoutConfig {
    this.labelWidth = width;
    return this;
  }

  /**
   * 设置字段宽度
   * @param width 宽度值
   * @returns 当前布局配置实例
   */
  setFieldWidth(width: string): LayoutConfig {
    this.fieldWidth = width;
    return this;
  }

  /**
   * 设置字段间距
   * @param spacing 间距值
   * @returns 当前布局配置实例
   */
  setSpacing(spacing: string): LayoutConfig {
    this.spacing = spacing;
    return this;
  }

  /**
   * 设置布局类型
   * @param type 布局类型
   * @returns 当前布局配置实例
   */
  setLayoutType(type: 'grid' | 'flex' | 'vertical'): LayoutConfig {
    this.layoutType = type;
    return this;
  }

  /**
   * 设置对齐方式
   * @param align 对齐方式
   * @returns 当前布局配置实例
   */
  setAlign(align: 'left' | 'center' | 'right'): LayoutConfig {
    this.align = align;
    return this;
  }
}

/**
 * 其他配置类
 * 用于存储难以归类的配置项
 */
export class OtherConfig {
  relatedIds?: Record<string, any>; // 关联的ID，如上一个界面的ID等
  contextData?: Record<string, any>; // 上下文数据
  metaData?: Record<string, any>; // 元数据
  [key: string]: any; // 允许添加任意其他属性

  /**
   * 构造函数
   * @param config 其他配置对象
   */
  constructor(config?: Record<string, any>) {
    this.relatedIds = config?.relatedIds || {};
    this.contextData = config?.contextData || {};
    this.metaData = config?.metaData || {};

    // 合并其他属性
    if (config) {
      Object.keys(config).forEach(key => {
        if (!['relatedIds', 'contextData', 'metaData'].includes(key)) {
          this[key] = config[key];
        }
      });
    }
  }

  /**
   * 设置关联ID
   * @param ids 关联ID对象
   * @returns 当前配置实例
   */
  setRelatedIds(ids: Record<string, any>): OtherConfig {
    this.relatedIds = ids;
    return this;
  }

  /**
   * 设置上下文数据
   * @param data 上下文数据
   * @returns 当前配置实例
   */
  setContextData(data: Record<string, any>): OtherConfig {
    this.contextData = data;
    return this;
  }

  /**
   * 设置元数据
   * @param data 元数据
   * @returns 当前配置实例
   */
  setMetaData(data: Record<string, any>): OtherConfig {
    this.metaData = data;
    return this;
  }

  /**
   * 设置任意属性
   * @param key 属性名
   * @param value 属性值
   * @returns 当前配置实例
   */
  setProperty(key: string, value: any): OtherConfig {
    this[key] = value;
    return this;
  }
}

/**
 * 表单配置类
 * 用于组合字段配置和布局配置
 */
export class FormConfiguration {
  fields: FieldConfig[];    // 字段配置列表
  layout: LayoutConfig;     // 布局配置
  otherConfig: OtherConfig; // 其他配置
  initialData: Record<string, any>; // 初始数据（表单回显数据）
  submitConfig: ButtonConfig; // 提交按钮配置
  cancelConfig: ButtonConfig; // 取消按钮配置
  dictData: Record<string, any>; // 全局数据字典
  loading: boolean;         // 加载状态
  disabled: boolean;        // 禁用状态

  /**
   * 构造函数
   * @param config 表单配置对象
   */
  constructor(config: {
    fields?: FieldConfig[];
    layout?: LayoutConfig;
    otherConfig?: OtherConfig | Record<string, any>;
    initialData?: Record<string, any>;
    submitConfig?: Partial<ButtonConfig>;
    cancelConfig?: Partial<ButtonConfig>;
    dictData?: Record<string, any>;
    loading?: boolean;
    disabled?: boolean;
  } = {}) {
    this.fields = config.fields || [];
    this.layout = config.layout || new LayoutConfig();
    this.otherConfig = config.otherConfig instanceof OtherConfig
      ? config.otherConfig
      : new OtherConfig(config.otherConfig);
    this.initialData = config.initialData || {};

    // 修改提交按钮配置的初始化方式
    this.submitConfig = config.submitConfig instanceof ButtonConfig
      ? config.submitConfig
      : new ButtonConfig({
          text: config.submitConfig?.text || '保存',
          show: config.submitConfig?.show !== undefined ? config.submitConfig.show : true,
          icon: config.submitConfig?.icon,
          onClick: config.submitConfig?.onClick,
          props: config.submitConfig?.props
        });

    // 修改取消按钮配置的初始化方式
    this.cancelConfig = config.cancelConfig instanceof ButtonConfig
      ? config.cancelConfig
      : new ButtonConfig({
          text: config.cancelConfig?.text || '取消',
          show: config.cancelConfig?.show !== undefined ? config.cancelConfig.show : true,
          icon: config.cancelConfig?.icon,
          onClick: config.cancelConfig?.onClick,
          props: config.cancelConfig?.props
        });

    this.dictData = config.dictData || {};
    this.loading = config.loading || false;
    this.disabled = config.disabled || false;
  }

  /**
   * 添加字段配置
   * @param field 字段配置或字段配置对象
   * @returns 当前表单配置实例
   */
  addField(field: FieldConfig | Partial<FieldConfig>): FormConfiguration {
    const fieldConfig = field instanceof FieldConfig ? field : new FieldConfig(field);
    this.fields.push(fieldConfig);
    return this;
  }

  /**
   * 批量添加字段配置
   * @param fields 字段配置数组
   * @returns 当前表单配置实例
   */
  addFields(fields: (FieldConfig | Partial<FieldConfig>)[]): FormConfiguration {
    fields.forEach(field => this.addField(field));
    return this;
  }

  /**
   * 设置布局配置
   * @param layout 布局配置或配置对象
   * @returns 当前表单配置实例
   */
  setLayout(layout: LayoutConfig | Partial<LayoutConfig>): FormConfiguration {
    if (layout instanceof LayoutConfig) {
      this.layout = layout;
    } else {
      this.layout = new LayoutConfig(layout);
    }
    return this;
  }

  /**
   * 设置其他配置
   * @param otherConfig 其他配置或配置对象
   * @returns 当前表单配置实例
   */
  setOtherConfig(otherConfig: OtherConfig | Record<string, any>): FormConfiguration {
    this.otherConfig = otherConfig instanceof OtherConfig
      ? otherConfig
      : new OtherConfig(otherConfig);
    return this;
  }

  /**
   * 设置初始数据
   * @param data 初始数据对象
   * @returns 当前表单配置实例
   */
  setInitialData(data: Record<string, any>): FormConfiguration {
    this.initialData = data;
    return this;
  }

  /**
   * 设置提交按钮配置
   * @param config 提交按钮配置
   * @returns 当前表单配置实例
   */
  setSubmitConfig(config: Partial<ButtonConfig>): FormConfiguration {
    this.submitConfig = {
      ...this.submitConfig,
      ...config
    };
    return this;
  }

  /**
   * 设置取消按钮配置
   * @param config 取消按钮配置
   * @returns 当前表单配置实例
   */
  setCancelConfig(config: Partial<ButtonConfig>): FormConfiguration {
    this.cancelConfig = {
      ...this.cancelConfig,
      ...config
    };
    return this;
  }

  /**
   * 设置全局数据字典
   * @param dictData 数据字典对象
   * @returns 当前表单配置实例
   */
  setDictData(dictData: Record<string, any>): FormConfiguration {
    this.dictData = dictData;
    return this;
  }

  /**
   * 设置加载状态
   * @param loading 是否加载中
   * @returns 当前表单配置实例
   */
  setLoading(loading: boolean): FormConfiguration {
    this.loading = loading;
    return this;
  }

  /**
   * 设置禁用状态
   * @param disabled 是否禁用
   * @returns 当前表单配置实例
   */
  setDisabled(disabled: boolean): FormConfiguration {
    this.disabled = disabled;
    return this;
  }

  /**
   * 获取配置对象，用于传递给ConfigurableForm组件
   * @returns 配置对象
   */
  getConfig(): {
    fields: FieldConfig[];
    layout: LayoutConfig;
    initialData: Record<string, any>;
    submitConfig: ButtonConfig;
    cancelConfig: ButtonConfig;
    dictData: Record<string, any>;
    loading: boolean;
    disabled: boolean;
    otherConfig: OtherConfig;
  } {
    return {
      fields: this.fields,
      layout: this.layout,
      initialData: this.initialData,
      submitConfig: this.submitConfig,
      cancelConfig: this.cancelConfig,
      dictData: this.dictData,
      loading: this.loading,
      disabled: this.disabled,
      otherConfig: this.otherConfig
    };
  }
}

type ConfigurableFormProps = {
  formConfiguration?: FormConfiguration;
};

const AppConfigurableForm = ({ formConfiguration }: ConfigurableFormProps) => {
  const config = formConfiguration;

  const resolvedFields = config?.fields ?? [];
  const resolvedLayout = config?.layout ?? new LayoutConfig({ fieldsPerRow: 2 });
  const resolvedInitialData = config?.initialData ?? {};
  const resolvedDictData = config?.dictData ?? {};
  const resolvedLoading = config?.loading ?? false;
  const resolvedDisabled = config?.disabled ?? false;

  const resolvedSubmitConfig = config?.submitConfig ?? { text: '保存', show: true };
  const resolvedCancelConfig = config?.cancelConfig ?? { text: '取消', show: true };

  // 保持原有表单状态管理，避免破坏现有业务逻辑
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (resolvedInitialData) {
      for (const field of resolvedFields) {
        if (!resolvedInitialData[field.name] && field.defaultValue !== undefined) {
          resolvedInitialData[field.name] = field.defaultValue;
        }
      }
      setFormData({ ...resolvedInitialData });
    }
  }, []);

  const chunkArray = (array: FieldConfig[], size: number) => {
    const result: FieldConfig[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const getFieldValue = (field: FieldConfig) => {
    const fieldName = field.name;
    if (!fieldName) return '';

    if (fieldName.includes('.')) {
      return fieldName.split('.').reduce((obj, key) => {
        return obj && typeof obj === 'object' ? obj[key] : '';
      }, formData);
    }

    const value = formData[fieldName];
    if (value === undefined && !(fieldName in formData)) {
      return value || (field.defaultValue ? field.defaultValue : resolvedInitialData[fieldName]);
    }
    return value;
  };

  const setFieldValue = (fieldName: string, value: any) => {
    setFormData(prevData => {
      const newData = { ...prevData };

      if (fieldName.includes('.')) {
        const parts = fieldName.split('.');
        let current = newData;
        for (let i = 0; i < parts.length - 1; i += 1) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
      } else {
        newData[fieldName] = value;
      }

      return newData;
    });

    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    resolvedFields.forEach(field => {
      if (field.hidden) return;

      const value = getFieldValue(field);
      if (field.required && (value === 'undefined' || (typeof value === 'string' && value.trim() === ''))) {
        newErrors[field.name] = field.validateMessage || `请填写${field.label}`;
        isValid = false;
      }

      if (field.validateRule && value && !field.validateRule.test(value)) {
        newErrors[field.name] = field.validateMessage || `${field.label}格式不正确`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();

    if (!validateForm()) {
      const firstErrorField = document.querySelector('.form-field-has-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (resolvedSubmitConfig.onClick) {
      if (!formData || Object.keys(formData).length === 0) {
        resolvedSubmitConfig.onClick(event, resolvedInitialData || {});
      } else {
        resolvedSubmitConfig.onClick(event, formData);
      }
    }
  };

  const handleFieldChange = (value: any, fieldPath?: string, fieldConfig?: FieldConfig) => {
    const name = fieldPath || fieldConfig?.name;
    if (!name) return;

    let nextValue = value;
    if (fieldConfig?.dataType && nextValue !== '' && nextValue != null) {
      switch (fieldConfig.dataType) {
        case DataType.NUMBER:
          nextValue = Number(nextValue);
          break;
        case DataType.BOOLEAN:
          nextValue = Boolean(nextValue);
          break;
        case DataType.ARRAY:
          nextValue = Array.isArray(nextValue) ? nextValue : [nextValue];
          break;
        case DataType.OBJECT:
          break;
        case DataType.STRING:
        default:
          break;
      }
    }

    setFieldValue(name, nextValue);

    if (fieldConfig?.onFieldChange && typeof fieldConfig.onFieldChange === 'function') {
      if (fieldConfig.type === FieldType.SELECT) {
        const options = Array.isArray(fieldConfig.options) ? fieldConfig.options : [];
        fieldConfig.onFieldChange(name, options.find(option => option.value === nextValue), null);
      } else {
        fieldConfig.onFieldChange(name, nextValue, null);
      }
    }
  };

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (resolvedCancelConfig.onClick) {
      resolvedCancelConfig.onClick(event);
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderField = (field: FieldConfig) => {
    if (field.hidden) return null;

    const fieldValue = getFieldValue(field);
    const isDisabled = field.disabled || resolvedDisabled;
    const hasError = !!errors[field.name];
    const fieldClassName = `form-field ${hasError ? 'form-field-has-error' : ''} flex flex-col flex-1`;

    let options = field.options || [field.defaultValue];
    if (typeof options === 'string' && resolvedDictData[options]) {
      options = resolvedDictData[options];
    }

    if (field.customRender) {
      return field.customRender(field, fieldValue, (value) => handleFieldChange(value, field.name, field));
    }

    return (
      <div key={field.name} className={fieldClassName}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === FieldType.SELECT ? (
          <Select
            value={fieldValue ?? (field.defaultValue || undefined)}
            onChange={(value) => handleFieldChange(value, field.name, field)}
            placeholder={field.placeholder || '请选择'}
            disabled={isDisabled}
            className="w-full"
            options={Array.isArray(options) ? options.map((opt, idx) => ({
              value: opt.value ?? opt.key ?? opt ?? `${field.name}-${idx}`,
              label: opt.label ?? opt.key ?? opt
            })) : []}
          />
        ) : field.type === FieldType.RADIO ? (
          <Radio.Group
            value={fieldValue ?? (field.defaultValue || undefined)}
            onChange={(event) => handleFieldChange(event.target.value, field.name, field)}
            disabled={isDisabled}
          >
            {(Array.isArray(options) ? options : []).map((opt, idx) => {
              const optionValue = opt.value ?? opt.key ?? opt ?? `${field.name}-${idx}`;
              const optionLabel = opt.label ?? opt.key ?? opt;
              return (
                <Radio key={optionValue} value={optionValue}>
                  {optionLabel}
                </Radio>
              );
            })}
          </Radio.Group>
        ) : field.type === FieldType.CHECKBOX ? (
          <Checkbox
            checked={Boolean(fieldValue)}
            onChange={(event) => handleFieldChange(event.target.checked, field.name, field)}
            disabled={isDisabled}
          >
            {field.placeholder || field.label}
          </Checkbox>
        ) : field.type === FieldType.TEXTAREA ? (
          <Input.TextArea
            value={fieldValue ?? (field.defaultValue || '')}
            onChange={(event) => handleFieldChange(event.target.value, field.name, field)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            rows={field.componentProps?.rows || 4}
          />
        ) : field.type === FieldType.PASSWORD ? (
          <div className="relative">
            <Input
              type={passwordVisibility[field.name] ? 'text' : 'password'}
              value={fieldValue ?? (field.defaultValue || '')}
              onChange={(event) => handleFieldChange(event.target.value, field.name, field)}
              placeholder={field.placeholder}
              disabled={isDisabled}
              className="pr-10"
            />
            {!isDisabled && (
              <div
                onClick={() => togglePasswordVisibility(field.name)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-gray-700"
                style={{ userSelect: 'none' }}
              >
                <FontAwesomeIcon icon={passwordVisibility[field.name] ? faEyeSlash : faEye} />
              </div>
            )}
          </div>
        ) : field.type === FieldType.NUMBER ? (
          <InputNumber
            value={fieldValue ?? (field.defaultValue || undefined)}
            onChange={(value) => handleFieldChange(value, field.name, field)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            min={field.componentProps?.min}
            max={field.componentProps?.max}
            step={field.componentProps?.step || 1}
            className="w-full"
          />
        ) : (
          <Input
            type={field.type || 'text'}
            value={fieldValue ?? (field.defaultValue || '')}
            onChange={(event) => handleFieldChange(event.target.value, field.name, field)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            {...(field.componentProps || {})}
          />
        )}

        {hasError && (
          <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
        )}

        {field.tips && !hasError && (
          <p className="mt-1 text-xs text-gray-500">{field.tips}</p>
        )}
      </div>
    );
  };

  const visibleFields = resolvedFields.filter(field => !field.hidden);
  const fieldsPerRow = resolvedLayout.fieldsPerRow || 2;
  const fieldRows = chunkArray(visibleFields, fieldsPerRow);
  const shouldShowButtons = resolvedSubmitConfig.show || resolvedCancelConfig.show;

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        .form-field {
          padding: 0.5rem 0;
        }

        .form-field-has-error {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }

        @media (max-width: 768px) {
          .configurable-form .grid-cols-1.md\\:grid-cols-2,
          .configurable-form .grid-cols-1.md\\:grid-cols-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className={`space-y-6 ${resolvedLoading ? 'opacity-70' : ''}`}>
        {fieldRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid gap-4 
              grid-cols-1 
              ${resolvedLayout.layoutType === 'grid'
                ? `md:grid-cols-${fieldsPerRow} auto-cols-fr`
                : 'md:flex md:gap-6'}`}
          >
            {row.map(field => renderField(field))}
          </div>
        ))}
      </div>

      {shouldShowButtons && (
        <div className="mt-8 flex justify-end space-x-3">
          {resolvedCancelConfig.show && (
            <Button
              type="default"
              onClick={handleCancel}
              disabled={resolvedLoading}
              className={resolvedCancelConfig.props?.className || 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}
              {...resolvedCancelConfig.props}
            >
              {resolvedCancelConfig.text}
            </Button>
          )}
          {resolvedSubmitConfig.show && (
            <Button
              type="primary"
              htmlType="submit"
              disabled={resolvedLoading}
              className={resolvedSubmitConfig.props?.className || 'border-transparent text-white bg-blue-600 hover:bg-blue-700'}
              {...resolvedSubmitConfig.props}
            >
              {resolvedLoading ? (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                  处理中...
                </span>
              ) : (
                resolvedSubmitConfig.text
              )}
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default AppConfigurableForm;

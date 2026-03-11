/**
 * 日期时间工具类
 */

/**
 * 将日期时间格式化为 yyyy-MM-dd hh:mm:ss 格式
 * @param {string|number|Date} date - 要格式化的日期时间
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  // 如果是字符串且已经是标准格式，直接返回
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
    return date;
  }
  
  // 创建 Date 对象
  const d = new Date(date);
  
  // 检查日期是否有效
  if (isNaN(d.getTime())) return '';
  
  // 获取年月日时分秒
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  // 返回格式化后的字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 将日期格式化为 yyyy-MM-dd 格式
 * @param {string|number|Date} date - 要格式化的日期
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  // 如果是字符串且已经是标准格式，直接返回
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // 创建 Date 对象
  const d = new Date(date);
  
  // 检查日期是否有效
  if (isNaN(d.getTime())) return '';
  
  // 获取年月日
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  // 返回格式化后的字符串
  return `${year}-${month}-${day}`;
};

/**
 * 获取当前时间的 yyyy-MM-dd hh:mm:ss 格式
 * @returns {string} 当前时间的格式化字符串
 */
export const getCurrentDateTime = () => {
  return formatDateTime(new Date());
};

/**
 * 获取相对时间描述（如：1小时前，2天前等）
 * @param {string|number|Date} date - 要计算相对时间的日期
 * @returns {string} 相对时间描述
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return '刚刚';
  } else if (diffMin < 60) {
    return `${diffMin}分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour}小时前`;
  } else if (diffDay < 30) {
    return `${diffDay}天前`;
  } else {
    return formatDateTime(d);
  }
};

/**
 * 将 datetime-local 输入值转换为完整的日期时间格式
 * @param {string} dateTimeLocal - datetime-local 输入值 (yyyy-MM-ddThh:mm)
 * @returns {string} 完整的日期时间格式 (yyyy-MM-dd hh:mm:ss)
 */
export const convertDateTimeLocalToFull = (dateTimeLocal) => {
  if (!dateTimeLocal) return '';
  
  // 将 T 替换为空格
  const dateTime = dateTimeLocal.replace('T', ' ');
  
  // 如果已经包含秒数，直接返回
  if (dateTime.includes(':')) {
    const parts = dateTime.split(':');
    if (parts.length === 3) {
      return dateTime;
    }
  }
  
  // 添加秒数（默认为00）
  return `${dateTime}:00`;
};

/**
 * 获取一天的开始时间 (00:00:00)
 * @param {string} date - 日期字符串 (yyyy-MM-dd)
 * @returns {string} 日期时间字符串 (yyyy-MM-dd 00:00:00)
 */
export const getStartOfDay = (date) => {
  if (!date) return '';
  return `${date} 00:00:00`;
};

/**
 * 获取一天的结束时间 (23:59:59)
 * @param {string} date - 日期字符串 (yyyy-MM-dd)
 * @returns {string} 日期时间字符串 (yyyy-MM-dd 23:59:59)
 */
export const getEndOfDay = (date) => {
  if (!date) return '';
  return `${date} 23:59:59`;
};

export default {
  formatDateTime,
  formatDate,
  getCurrentDateTime,
  getRelativeTime,
  convertDateTimeLocalToFull,
  getStartOfDay,
  getEndOfDay
};
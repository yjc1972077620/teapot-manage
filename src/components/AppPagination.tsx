import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Pagination as AntPagination, Select } from 'antd';

type JumpText = {
  prefix: string;
  suffix: string;
  confirm: string;
};

type PaginationProps = {
  totalItems: number;
  onPageChange: (currentPage: number, pageSize: number) => void;
  defaultPageSize?: number;
  currentPage?: number;
  pageSizeOptions?: number[];
  maxVisiblePages?: number;
  showSizeChanger?: boolean;
  showTotal?: boolean;
  prevText?: React.ReactNode;
  nextText?: React.ReactNode;
  jumpText?: JumpText;
};

const getVisiblePages = (current: number, totalPages: number, maxVisiblePages: number) => {
  const pages = new Set<number>();
  if (maxVisiblePages <= 0) return pages;
  const half = Math.floor(maxVisiblePages / 2);

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i += 1) pages.add(i);
    return pages;
  }

  pages.add(1);
  pages.add(totalPages);

  if (current <= half) {
    for (let i = 1; i <= maxVisiblePages; i += 1) pages.add(i);
    return pages;
  }

  if (current >= totalPages - half) {
    for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i += 1) pages.add(i);
    return pages;
  }

  for (let i = current - half; i <= current + half; i += 1) pages.add(i);
  return pages;
};

const AppPagination = ({
  totalItems,
  onPageChange,
  defaultPageSize = 10,
  currentPage = 1,
  pageSizeOptions = [10, 20, 50, 100],
  maxVisiblePages = 5,
  showSizeChanger = true,
  showTotal = true,
  prevText = '上一页',
  nextText = '下一页',
  jumpText = { prefix: '跳至', suffix: '页', confirm: '确定' },
}: PaginationProps) => {
  // 组件内部分页大小，保持与旧组件行为一致
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  // 跳转输入框的值
  const [pageInput, setPageInput] = useState(() => currentPage.toString());
  // 移动端布局开关
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 768 : false));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPageSize(defaultPageSize);
  }, [defaultPageSize]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    setPageInput(validPage.toString());
  }, [validPage]);

  const visiblePages = useMemo(() => getVisiblePages(validPage, totalPages, maxVisiblePages), [maxVisiblePages, totalPages, validPage]);
  const showJumpPrev = totalPages > maxVisiblePages && validPage > Math.floor(maxVisiblePages / 2) + 1;
  const showJumpNext = totalPages > maxVisiblePages && validPage < totalPages - Math.floor(maxVisiblePages / 2);

  const handlePageChange = (page: number) => {
    onPageChange(page, pageSize);
  };

  const handleSizeChange = (value: number) => {
    setPageSize(value);
    onPageChange(1, value);
  };

  const handleJump = () => {
    const targetPage = Number(pageInput);
    if (!Number.isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages && targetPage !== validPage) {
      onPageChange(targetPage, pageSize);
      return;
    }
    setPageInput(validPage.toString());
  };

  if (totalPages <= 1 && !showSizeChanger) return null;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#333',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: isMobile ? 'column' : 'row'
  };

  return (
    <nav style={containerStyle} aria-label="分页导航">
      {showTotal && (
        <div style={styles.totalInfo}>
          共 {totalItems} 条，显示 {(validPage - 1) * pageSize + 1} - {Math.min(validPage * pageSize, totalItems)} 条
        </div>
      )}

      {showSizeChanger && (
        <div style={styles.sizeChanger}>
          每页
          <Select
            value={pageSize}
            onChange={handleSizeChange}
            style={styles.sizeSelect}
            options={pageSizeOptions.map(size => ({ value: size, label: `${size} 条` }))}
          />
        </div>
      )}

      <AntPagination
        current={validPage}
        pageSize={pageSize}
        total={totalItems}
        showSizeChanger={false}
        showQuickJumper={false}
        onChange={handlePageChange}
        itemRender={(page, type, element) => {
          const safeClone = (content: React.ReactNode) => (React.isValidElement(element) ? React.cloneElement(element, undefined, content) : element);
          if (type === 'prev') return prevText ? safeClone(prevText) : element;
          if (type === 'next') return nextText ? safeClone(nextText) : element;
          if (type === 'jump-prev') return showJumpPrev ? element : null;
          if (type === 'jump-next') return showJumpNext ? element : null;
          if (type === 'page') return visiblePages.has(page) ? element : null;
          return element;
        }}
      />

      <div style={styles.jumpForm}>
        <span>{jumpText.prefix}</span>
        <Input
          value={pageInput}
          onChange={(event) => setPageInput(event.target.value.replace(/\D/g, ''))}
          style={styles.jumpInput}
          maxLength={String(totalPages).length}
          aria-label="页码输入"
        />
        <span>{jumpText.suffix}</span>
        <Button type="primary" onClick={handleJump} style={styles.jumpButton}>
          {jumpText.confirm}
        </Button>
      </div>
    </nav>
  );
};

const styles = {
  totalInfo: {
    fontSize: '0.9rem',
    color: '#666',
    order: -1
  },
  sizeChanger: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  sizeSelect: {
    minWidth: '6.5rem'
  },
  jumpForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  jumpInput: {
    width: '3rem',
    height: '2.5rem',
    textAlign: 'center' as const,
    fontSize: '0.9rem'
  },
  jumpButton: {
    height: '2.5rem',
    padding: '0 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem'
  }
};

export default AppPagination;

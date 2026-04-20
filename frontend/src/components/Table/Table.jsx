import styles from './Table.module.css'

export default function Table({ columns = [], rows = [], title = '', subtitle = '' }) {
  return (
    <div className={styles.wrap}>
      {title && (
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <span className={styles.count}>{rows.length} entries</span>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={styles.th}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  <span className={styles.emptyIcon}>◎</span>
                  <p>No data available</p>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className={styles.tr}>
                  {columns.map((col, j) => (
                    <td key={j} className={`${styles.td} ${styles[col.type] || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
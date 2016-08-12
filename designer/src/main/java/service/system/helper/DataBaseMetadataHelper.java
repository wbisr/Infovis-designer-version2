package service.system.helper;

import com.alibaba.druid.pool.DruidDataSource;
import core.plugin.spring.database.route.DynamicDataSource;
import model.database.ColumnMetaData;
import model.database.JdbcProps;
import model.database.TableMetaData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.support.JdbcUtils;

import java.sql.*;
import java.util.*;

/**
 * Created by gzy on 2016/8/11.
 */
public class DataBaseMetadataHelper {

    private static final Logger L = LoggerFactory.getLogger(DataBaseMetadataHelper.class);

    private static final Map<Integer, String> JDBC_TYPE_MAP = new HashMap<Integer, String>();

    static {
        JDBC_TYPE_MAP.put(Types.ARRAY, "array");
        JDBC_TYPE_MAP.put(Types.BIGINT, "bigInt");
        JDBC_TYPE_MAP.put(Types.BINARY, "binary");
        JDBC_TYPE_MAP.put(Types.BIT, "bit");
        JDBC_TYPE_MAP.put(Types.BLOB, "blob");
        JDBC_TYPE_MAP.put(Types.BOOLEAN, "boolean");
        JDBC_TYPE_MAP.put(Types.CHAR, "char");
        JDBC_TYPE_MAP.put(Types.CLOB, "clob");
        JDBC_TYPE_MAP.put(Types.DATALINK, "dataLink");
        JDBC_TYPE_MAP.put(Types.DATE, "date");
        JDBC_TYPE_MAP.put(Types.DECIMAL, "decimal");
        JDBC_TYPE_MAP.put(Types.DISTINCT, "distinct");
        JDBC_TYPE_MAP.put(Types.DOUBLE, "double");
        JDBC_TYPE_MAP.put(Types.FLOAT, "float");
        JDBC_TYPE_MAP.put(Types.INTEGER, "integer");
        JDBC_TYPE_MAP.put(Types.JAVA_OBJECT, "java_object");
        JDBC_TYPE_MAP.put(Types.LONGNVARCHAR, "longnvarchar");
        JDBC_TYPE_MAP.put(Types.LONGVARBINARY, "longvarbinary");
        JDBC_TYPE_MAP.put(Types.LONGVARCHAR, "longvarchar");
        JDBC_TYPE_MAP.put(Types.NCHAR, "nchar");
        JDBC_TYPE_MAP.put(Types.NCLOB, "nclob");
        JDBC_TYPE_MAP.put(Types.NULL, "null");
        JDBC_TYPE_MAP.put(Types.NUMERIC, "numeric");
        JDBC_TYPE_MAP.put(Types.NVARCHAR, "nvarchar");
        JDBC_TYPE_MAP.put(Types.OTHER, "other");
        JDBC_TYPE_MAP.put(Types.REAL, "real");
        JDBC_TYPE_MAP.put(Types.REF, "ref");
        JDBC_TYPE_MAP.put(Types.ROWID, "rowid");
        JDBC_TYPE_MAP.put(Types.SMALLINT, "smallint");
        JDBC_TYPE_MAP.put(Types.SQLXML, "sqlxml");
        JDBC_TYPE_MAP.put(Types.STRUCT, "struct");
        JDBC_TYPE_MAP.put(Types.TIME, "time");
        JDBC_TYPE_MAP.put(Types.TIMESTAMP, "timestamp");
        JDBC_TYPE_MAP.put(Types.TINYINT, "tinyint");
        JDBC_TYPE_MAP.put(Types.VARBINARY, "varbinary");
        JDBC_TYPE_MAP.put(Types.VARCHAR, "varchar");
    }

    public static List<TableMetaData> getSchemaTables(DynamicDataSource dynamicDataSource, JdbcProps jdbcProps) throws Exception {
        Connection conn = null;
        ResultSet tRs = null;
        List<TableMetaData> tableMetaDatas = new ArrayList<>();
        try {
            dynamicDataSource.selectDataSource(jdbcProps.getUrl(), jdbcProps.getUsername(), jdbcProps.getPassword());
            conn = dynamicDataSource.getConnection();
            DatabaseMetaData metaData = conn.getMetaData();
            String[] tableTypes = {"TABLE"};

            tRs = metaData.getTables(null, "%", null, tableTypes);
            while (tRs.next()) {
                TableMetaData tableMetaData = new TableMetaData();
                tableMetaData.setTableName(tRs.getString("TABLE_NAME").toLowerCase());
                tableMetaData.setTableType(tRs.getString("TABLE_TYPE"));
                tableMetaData.setTableRemark(tRs.getString("REMARKS"));
                tableMetaDatas.add(tableMetaData);
            }
        } catch (SQLException e) {
            L.error("获取数据库表元数据异常", e);
        } finally {
            JdbcUtils.closeResultSet(tRs);
            JdbcUtils.closeConnection(conn);
        }
        return tableMetaDatas;
    }

    private static String checkTableColumnType(int type) {
        String typeName = "";
        switch (type) {
            case Types.BIGINT:
            case Types.INTEGER:
            case Types.SMALLINT:
            case Types.TINYINT:
            case Types.DECIMAL:
                typeName = "int";
                break;
            case Types.DOUBLE:
            case Types.FLOAT:
            case Types.NUMERIC:
                typeName = "double";
                break;
            case Types.CHAR:
            case Types.CLOB:
            case Types.VARCHAR:
            case Types.LONGVARCHAR:
            case Types.LONGNVARCHAR:
            case Types.DATE:
            case Types.TIME:
            case Types.TIMESTAMP:
                typeName = "String";
                break;
            default:
                typeName = "byte[]";
                break;
        }
        return typeName;
    }

    public static List<ColumnMetaData> getSchemaTableColumns(DynamicDataSource dynamicDataSource, JdbcProps jdbcProps,String tableName) throws Exception {
        Connection conn = null;
        ResultSet cRs = null;
        List<ColumnMetaData> columnMetaDatas = new ArrayList<>();
        try {
            dynamicDataSource.selectDataSource(jdbcProps.getUrl(), jdbcProps.getUsername(), jdbcProps.getPassword());
            conn = dynamicDataSource.getConnection();
            DatabaseMetaData metaData = conn.getMetaData();
            cRs = metaData.getColumns(null, "%", tableName, "%");
            while (cRs.next()) {
                ColumnMetaData columnMetaData = new ColumnMetaData();
                String columnType = "";
                String columnName = cRs.getString("COLUMN_NAME");
                String remark = cRs.getString("REMARKS");
                int dataType = cRs.getInt("DATA_TYPE");
                boolean isAutoIncrement = cRs.getBoolean("IS_AUTOINCREMENT");
                columnType = checkTableColumnType(dataType);
                columnMetaData.setColumnName(columnName.toLowerCase());
                columnMetaData.setColumnType(columnType);
                columnMetaData.setJdbcType(JDBC_TYPE_MAP.get(dataType));
                columnMetaData.setColumnRemark(remark);
                columnMetaData.setColumnAutoIncrement(isAutoIncrement);
                columnMetaDatas.add(columnMetaData);
            }
        } catch (SQLException e) {
            L.error("获取数据库表元数据字段异常", e);
        } finally {
            JdbcUtils.closeResultSet(cRs);
            JdbcUtils.closeConnection(conn);
        }
        return columnMetaDatas;
    }

    public static boolean isEffectiveDataSouce(DynamicDataSource dynamicDataSource,JdbcProps jdbcProps){
        DruidDataSource druidDataSource = dynamicDataSource.createDataSource(jdbcProps.getUrl(),jdbcProps.getUsername(),jdbcProps.getPassword());
        Boolean isSuccessConnect = true;
        try {
            druidDataSource.getConnection();
        } catch (SQLException e) {
            isSuccessConnect = false;
            L.error("获取数据库连接失败", e);
        }
        return isSuccessConnect;
    }
}

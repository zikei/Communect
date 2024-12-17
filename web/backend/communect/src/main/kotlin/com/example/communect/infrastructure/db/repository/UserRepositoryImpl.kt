package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.LoginUser
import com.example.communect.domain.model.User
import com.example.communect.domain.repository.UserRepository
import com.example.communect.infrastructure.db.mapper.UserMapper
import com.example.communect.infrastructure.db.mapper.select
import com.example.communect.infrastructure.db.mapper.selectOne
import org.mybatis.dynamic.sql.util.kotlin.elements.upper
import org.springframework.stereotype.Repository
import com.example.communect.infrastructure.db.mapper.UserDynamicSqlSupport as UserSql
import com.example.communect.infrastructure.db.record.User as UserRecord

/** ユーザリポジトリ実装クラス */
@Repository
class UserRepositoryImpl(
    private val userMapper: UserMapper
) : UserRepository {
    /**
     * ユーザ名によるログインユーザモデルの取得
     * @param name ユーザ名
     * @return 検索結果ログインユーザモデル
     */
    override fun findLoginUserByUserName(name: String): LoginUser? {
        val record = userMapper.selectOne {
            where { UserSql.username isEqualTo name }
        }
        return record?.let { toModelForLoginUser(it) }
    }

    /**
     * ユーザ名によるログインユーザモデルの取得
     * @param apikey apikey
     * @return 検索結果ログインユーザモデル
     */
    override fun findLoginUserByApikey(apikey: String): LoginUser? {
        val record = userMapper.selectOne {
            where { UserSql.apikey isEqualTo apikey }
        }
        return record?.let { toModelForLoginUser(it) }
    }

    /**
     * キーワードによるユーザの取得
     * @param keyword ユーザ名の部分一致 OR ユーザID
     * @return 検索結果ユーザリスト
     */
    override fun findByKeyword(keyword: String): List<User> {
        val records = userMapper.select {
            where {
                UserSql.userid isEqualTo keyword
                or {
                    upper(UserSql.username) isLike "%${keyword.uppercase().replace(' ', '%')}%"
                }
            }
        }
        return records.map { toModel(it) }
    }

    /** レコードのログインユーザモデルへの変換 */
    private fun toModelForLoginUser(record: UserRecord): LoginUser {
        return LoginUser(
            record.userid!!,
            record.username!!,
            record.nickname!!,
            record.password!!,
            record.email!!,
            record.apikey!!
        )
    }

    /** レコードのユーザモデルへの変換 */
    private fun toModel(record: UserRecord): User {
        return User(
            record.userid!!,
            record.username!!,
            record.nickname!!,
            record.email!!,
        )
    }
}
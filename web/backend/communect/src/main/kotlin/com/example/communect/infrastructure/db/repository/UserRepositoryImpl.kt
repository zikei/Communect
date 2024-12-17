package com.example.communect.infrastructure.db.repository

import com.example.communect.domain.model.LoginUser
import com.example.communect.domain.model.User
import com.example.communect.domain.model.UserIns
import com.example.communect.domain.model.UserUpd
import com.example.communect.domain.repository.UserRepository
import com.example.communect.infrastructure.db.mapper.*
import org.mybatis.dynamic.sql.util.kotlin.elements.upper
import org.springframework.stereotype.Repository
import java.util.*
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

    /**
     * ユーザIDによるユーザの取得
     * @param userId ユーザID
     * @return 検索結果ユーザ
     */
    override fun findByUserId(userId: String): User? {
        val record = userMapper.selectOne {
            where { UserSql.userid isEqualTo userId }
        }
        return record?.let { toModel(it) }
    }

    /**
     * ユーザIDによるApikeyの取得
     * @param userId ユーザID
     * @return apikey
     */
    override fun findApikeyByUserId(userId: String): String? {
        val record = userMapper.selectOne {
            where { UserSql.userid isEqualTo userId }
        }
        return record?.apikey
    }

    /**
     * ユーザ追加
     * @param user 追加ユーザ
     * @return 追加ユーザ
     */
    override fun insertUser(user: UserIns): User {
        val record = toRecord(user)
        userMapper.insert(record)
        return toModel(record)
    }

    /**
     * ユーザ更新
     * @param user 更新ユーザ
     */
    override fun updateUser(user: UserUpd) {
        val record = toRecord(user)
        userMapper.updateByPrimaryKeySelective(record)
    }

    /**
     * ユーザIDによるApikeyの更新
     * @param userId ユーザID
     * @param apikey 更新apikey
     * @return apikey
     */
    override fun updateApikeyByUserId(userId: String, apikey: String) {
        val record = UserRecord(userid = userId, apikey = apikey)
        userMapper.updateByPrimaryKeySelective(record)
    }

    /**
     * ユーザ削除
     * @param userId 削除対象ユーザID
     */
    override fun deleteByUserId(userId: String) {
        userMapper.deleteByPrimaryKey(userId)
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

    /** ユーザ追加モデルからレコードの変換 */
    private fun toRecord(model: UserIns): UserRecord {
        return UserRecord(
            UUID.randomUUID().toString(),
            model.userName,
            model.nickName,
            model.password,
            model.email,
            model.apikey
        )
    }

    /** ユーザ更新モデルからレコードの変換 */
    private fun toRecord(model: UserUpd): UserRecord {
        return UserRecord(
            model.userId,
            model.userName,
            model.nickName,
            model.password,
            model.email,
            null
        )
    }
}
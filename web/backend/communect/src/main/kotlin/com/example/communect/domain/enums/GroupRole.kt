package com.example.communect.domain.enums

/**
 * グループ連絡権限
 * HIGH: 高
 * MEDIUM: 中
 * LOW： 低
 * SAFE： 最低
 * NONE： 権限なし
 */
enum class GroupRole(val weight: Int) {
    HIGH(4), MEDIUM(3), LOW(2), SAFE(1), NONE(0)
}
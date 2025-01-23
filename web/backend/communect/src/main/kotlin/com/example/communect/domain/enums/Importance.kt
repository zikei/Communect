package com.example.communect.domain.enums

/**
 * グループ連絡権限
 * HIGH: 高
 * MEDIUM: 中
 * LOW： 低
 * SAFE： 最低
 */
enum class Importance(val weight: Int) {
    HIGH(4), MEDIUM(3), LOW(2), SAFE(1)
}
package com.example.communect.ui.validator

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import kotlin.reflect.KClass

@MustBeDocumented
@Constraint(validatedBy = [NullOrNotBlankValidator::class])
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
annotation class NullOrNotBlank(
    val message: String = "must be null or not blank",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class NullOrNotBlankValidator : ConstraintValidator<NullOrNotBlank, String?> {
    override fun isValid(value: String?, context: ConstraintValidatorContext): Boolean {
        return value == null || value.isNotBlank()
    }
}
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

//validation for text field
export class TextFieldValidator {
    static validTextField(fc: FormControl) {
        if (fc.value != "" && fc.value != undefined && fc.value != null) {
            const regex = /^[0-9a-zA-Z ]+$/
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validTextField: true } //validTextField given because the same function we are calling so incase error this will display so developer no need to come in this page again
            }
        } else {
            return null;
        }
    }
}

//Validation for Numeric field
export class NumericFieldValidator {
    static validNumericField(fc: FormControl) {
        if (fc.value != "" && fc.value != undefined && fc.value != null) {
            const regex = /[0-9]+/
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validNumericField: true }
            }
        } else {
            return null;
        }
    }
}

//character and space
export class CharFieldValidator {
    static validCharField(fc: FormControl) {
        if (fc.value != "" && fc.value != undefined && fc.value != null) {
            const regex = /^[a-zA-Z ]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validCharField: true }
            }
        } else {
            return null;
        }
    }
}

//not allow whitespace
export class NoWhiteSpaceValidator {
    static validWhitespaceField(fc: FormControl) {
        if (fc.value != "" && fc.value != undefined && fc.value != null) {
            const iswhitespace = (fc.value.toString().trim().length === 0)
            if (!iswhitespace) {
                return null;
            } else {
                return { validWhitespaceField: true }
            }
        } else {
            return null;
        }
    }
}

//above code only for one input field

//if we want for 2 input field like password and confirm password both should be same, below code.

//old code
// export function MustMatchValidator(controlName:string, matchControlName:string){

//     return (formGroup:FormGroup)=>{
//         // const control = formGroup.get(controlName); //to get the instance of controlName from formgroup 1 way below also same
//         const control = formGroup.controls[controlName];
//         const matchingControlName = formGroup.controls[matchControlName];
//         if(matchingControlName.errors && !matchingControlName.errors['MustMatch']){ //this is written because if re-enterpassward should same with above and no error then from here it will return and next if condition will not check
//             return;
//         }
//         if(control.value !== matchingControlName.value){
//             return matchingControlName.setErrors({MustMatch:true})
//         }else{
//             return matchingControlName.setErrors(null);

//         }
//     }

// }

//new code where multiple validation need
export function MustMatchValidator(controlName: string, matchControlName: string): ValidatorFn {

    return (ctrl: AbstractControl): ValidationErrors | null => {
        // const control = formGroup.get(controlName); //to get the instance of controlName from formgroup 1 way below also same
        const control = ctrl.get(controlName); //here insted offormGroup.controls we used ctrl.get() to not occure depricate error
        const matchingControlName = ctrl.get(matchControlName);
        if (matchingControlName.errors && !matchingControlName.errors['MustMatch']) { //this is written because if re-enterpassward should same with above and no error then from here it will return and next if condition will not check
            return null;
        }
        if (control.value !== matchingControlName.value) {
            matchingControlName.setErrors({ mustMatch: true })
        } else {
            matchingControlName.setErrors(null);

        }
        return null
    }

}
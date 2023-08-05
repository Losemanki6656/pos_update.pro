<?php

namespace App\SuperAdmin\Http\Requests\Api\PaymentSettings;

use Illuminate\Foundation\Http\FormRequest;

class PaypalUpdateRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */

	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$rules = [
			'paypal_client_id'    => 'required',
			'paypal_secret'    => 'required',
			'paypal_mode'    => 'required',
			'paypal_status'    => 'required',
		];

		return $rules;
	}
}


export function isEqual(A, B, method="stringify"){
	return JSON.stringify(A) === JSON.stringify(B)
}
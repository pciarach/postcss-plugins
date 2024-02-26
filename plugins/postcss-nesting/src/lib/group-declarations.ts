import type { ChildNode, Container } from 'postcss';

export default function groupDeclarations(node: Container<ChildNode>) {
	// https://drafts.csswg.org/css-nesting/#mixing
	// When a style rule contains both declarations and nested style rules or nested conditional group rules,
	// all three can be arbitrarily mixed.
	// However, the relative order of declarations vs other rules is not preserved in any way.
	//
	// For the purpose of determining the Order Of Appearance,
	// nested style rules and nested conditional group rules are considered to come after their parent rule.

	const declarationLikeThings: Array<ChildNode> = [];
	const ruleLikeThings: Array<ChildNode> = [];

	node.each((child) => {
		if (isDeclaration(child) || canContainDeclarations(child, ruleLikeThings.length === 0)) {
			declarationLikeThings.push(child);
			return;
		}

		if (child.type === 'comment') {
			let next = child.next();
			while (next && next.type === 'comment') {
				next = next.next();
			}

			if (isDeclaration(next) || canContainDeclarations(next, ruleLikeThings.length === 0)) {
				declarationLikeThings.push(child);
				return;
			}
		}

		ruleLikeThings.push(child);
	});

	node.removeAll();

	declarationLikeThings.forEach((child) => {
		node.append(child);
	});

	ruleLikeThings.forEach((child) => {
		node.append(child);
	});
}

function isDeclaration(node: ChildNode | undefined): boolean {
	return node && node.type === 'decl';
}

function canContainDeclarations(node: ChildNode | undefined, wouldBeFirstRuleLike: boolean): boolean {
	// We assume that
	// - a mixin after declarations will resolve to declarations
	// - a mixin after rules or at-rules will resolve to rules or at-rules
	return node &&
		node.type === 'atrule' &&
		node.name.toLowerCase() === 'mixin' &&
		wouldBeFirstRuleLike;
}

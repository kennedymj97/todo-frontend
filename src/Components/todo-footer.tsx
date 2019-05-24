import React from 'react';
import styled from 'styled-components';

const TodoFooterContainer = styled.footer`
	color: #777;
	padding: 10px 15px;
	height: 20px;
	text-align: center;
	border-top: 1px solid #e6e6e6;

	:before {
		content: '';
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 50px;
		overflow: hidden;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2),
			0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
	}
`;

const TodoCount = styled.span`
	float: left;
	text-align: left;

	strong {
		font-weight: 300;
	}
`;

const Filters = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	position: absolute;
	right: 0;
	left: 0;
`;

const FiltersItem = styled.li`
	display: inline;
	color: inherit;
	margin: 3px;
	padding: 3px 7px;
	text-decoration: none;
	border: 1px solid transparent;
	border-radius: 3px;
	${(props: ITodoFooterItemProps) => (props.selected ? `border-color: rgba(175, 47, 47, 0.2);` : ``)} :hover {
		border-color: rgba(175, 47, 47, 0.1);
	}
`;

const ClearButton = styled.button`
	float: right;
	position: relative;
	line-height: 20px;
	text-decoration: none;
	cursor: pointer;

	:hover {
		text-decoration: underline;
	}
`;

const TodoFooter: React.FC<ITodoFooterProps> = (props) => {
	const activeTodoWord = props.count === 1 ? 'item' : 'items';
	let clearButton = null;

	if (props.completedCount > 0) {
		clearButton = (
			<ClearButton onClick={props.onClearCompleted}>
				Clear completed
			</ClearButton>
		);
	}

	return (
		<TodoFooterContainer>
			<TodoCount>
				<strong>{props.count}</strong> {activeTodoWord} left
			</TodoCount>
			<Filters>
				<FiltersItem onClick={() => props.setShowing('all')} selected={props.nowShowing === 'all'}>All</FiltersItem>{' '}
				<FiltersItem onClick={() => props.setShowing('active')} selected={props.nowShowing === 'active'}>Active</FiltersItem>{' '}
				<FiltersItem onClick={() => props.setShowing('completed')} selected={props.nowShowing === 'completed'}>Completed</FiltersItem>
			</Filters>
			{clearButton}
		</TodoFooterContainer>
	);
};

export default TodoFooter;

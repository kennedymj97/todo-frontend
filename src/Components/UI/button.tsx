import styled from 'styled-components';

const Button = styled.button`
	margin: 0;
	padding: 0 2rem;
	height: 2.5rem;
	line-height: 2.5rem;
	border-radius: 7px;
	background-color: rgba(175, 47, 47, 0.15);
	box-shadow: rgba(175, 47, 47, 0.07);
	color: white;
	display: inline-block;
	cursor: pointer;
	text-decoration: none;
	border: none;
	font-size: inherit;
	transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
	width: 160px;

	:hover {
		background: rgba(175, 47, 47, 0.13);
		box-shadow: 0 6px 20px rgba(175, 47, 47, 0.05);
	}

	:active {
		background: rgba(175, 47, 47, 0.20);
	}
`;

export default Button;

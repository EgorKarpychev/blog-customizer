import { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';
import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	appliedState: ArticleStateType;
	onApply: (params: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	appliedState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [formState, setFormState] = useState<ArticleStateType>(appliedState);

	const asideRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (isMenuOpen) {
			setFormState(appliedState);
		}
	}, [isMenuOpen, appliedState]);

	const close = useCallback(() => {
		setIsMenuOpen(false);
		setFormState(appliedState);
	}, [appliedState]);

	const open = useCallback(() => {
		setIsMenuOpen(true);
	}, []);

	const handleToggle = useCallback(() => {
		if (isMenuOpen) {
			close();
		} else {
			open();
		}
	}, [isMenuOpen, close, open]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				asideRef.current &&
				!asideRef.current.contains(event.target as Node)
			) {
				close();
			}
		};
		if (isMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen, close]);

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};
		if (isMenuOpen) {
			document.addEventListener('keydown', handleEsc);
		}
		return () => {
			document.removeEventListener('keydown', handleEsc);
		};
	}, [isMenuOpen, close]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	const handleReset = () => {
		onReset();
		setFormState(defaultArticleState);
	};

	const handleFontFamilyChange = (option: OptionType) =>
		setFormState({ ...formState, fontFamilyOption: option });
	const handleFontSizeChange = (option: OptionType) =>
		setFormState({ ...formState, fontSizeOption: option });
	const handleFontColorChange = (option: OptionType) =>
		setFormState({ ...formState, fontColor: option });
	const handleBgColorChange = (option: OptionType) =>
		setFormState({ ...formState, backgroundColor: option });
	const handleContentWidthChange = (option: OptionType) =>
		setFormState({ ...formState, contentWidth: option });

	return (
		<>
			<ArrowButton isOpen={isMenuOpen} onClick={handleToggle} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen,
				})}
				ref={asideRef}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text size={31} weight={800} uppercase>
						задайте параметры
					</Text>
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleFontFamilyChange}
					/>
					<RadioGroup
						name='fontSize'
						title='Размер шрифта'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={handleFontSizeChange}
					/>
					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={handleFontColorChange}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={handleBgColorChange}
					/>
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={handleContentWidthChange}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};

import React, { useEffect, useState } from 'react';

import { FormGroup } from '@patternfly/react-core';
import {
  Button,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core/dist/esm';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import {
  changeKernelName,
  selectKernel,
} from '../../../../../store/wizardSlice';

let kernelOptions = ['kernel', 'kernel-debug'];

const KernelName = () => {
  const dispatch = useAppDispatch();
  const kernel = useAppSelector(selectKernel).name;

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<string[]>(kernelOptions);

  useEffect(() => {
    let filteredKernelPkgs = kernelOptions;

    if (filterValue) {
      filteredKernelPkgs = kernelOptions.filter((kernel: string) =>
        String(kernel).toLowerCase().includes(filterValue.toLowerCase())
      );
      if (!filteredKernelPkgs.some((kernel) => kernel === filterValue)) {
        filteredKernelPkgs = [
          ...filteredKernelPkgs,
          `Custom kernel package "${filterValue}"`,
        ];
      }
      if (!isOpen) {
        setIsOpen(true);
      }
    }
    setSelectOptions(filteredKernelPkgs);

    // This useEffect hook should run *only* on when the filter value changes.
    // eslint's exhaustive-deps rule does not support this use.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  const onToggle = (isOpen: boolean) => {
    setIsOpen(!isOpen);
  };

  const onInputClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (!inputValue) {
      setIsOpen(false);
    }
  };

  const onSelect = (_event: React.MouseEvent, value: string) => {
    if (value) {
      if (/custom kernel package/i.test(value)) {
        if (!kernelOptions.some((kernel) => kernel === filterValue)) {
          kernelOptions = [...kernelOptions, filterValue];
        }
        dispatch(changeKernelName(filterValue));
        setFilterValue('');
        setIsOpen(false);
      } else {
        setInputValue(value);
        setFilterValue('');
        dispatch(changeKernelName(value));
        setIsOpen(false);
      }
    }
  };

  const onTextInputChange = (_event: React.FormEvent, value: string) => {
    setInputValue(value);
    setFilterValue(value);

    if (value !== kernel) {
      dispatch(changeKernelName(''));
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onClearButtonClick = () => {
    setInputValue('');
    setFilterValue('');
    dispatch(changeKernelName(''));
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={onToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={kernel ? kernel : inputValue}
          onClick={onInputClick}
          onChange={onTextInputChange}
          autoComplete="off"
          placeholder="Select kernel package"
          isExpanded={isOpen}
        />

        {kernel && (
          <TextInputGroupUtilities>
            <Button
              variant="plain"
              onClick={onClearButtonClick}
              aria-label="Clear input"
            >
              <TimesIcon />
            </Button>
          </TextInputGroupUtilities>
        )}
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <FormGroup isRequired={false} label="Name">
      <Select
        isScrollable
        isOpen={isOpen}
        selected={kernel}
        onSelect={onSelect}
        onOpenChange={onToggle}
        toggle={toggle}
        shouldFocusFirstItemOnOpen={false}
      >
        <SelectList>
          {selectOptions.map((option) => (
            <SelectOption key={option} value={option}>
              {option}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </FormGroup>
  );
};

export default KernelName;

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FormGroup from '@/app/shared/form-group';
import cn from '@/utils/class-names';
import { useFormContext } from 'react-hook-form';
import { PiTagBold, PiTagDuotone, PiXBold } from 'react-icons/pi';

export default function FeedTags(
  {
    tagAdd,
    tagRemove,
    className
  }
  :
  {
    tagAdd: (tag: string) => void
    tagRemove: (tag: string) => void
    className?: string
  })
  {



  const [tags, setTags] = useState<string[]>([]);
  
  /*
  return (

    <ItemCrud name="태그" items={tags} setItems={setTags} />

    
    <FormGroup
      title=""
      //description="태그를 입력하세요."
      className={cn(className)}
    >
    
      <ItemCrud name="태그" items={tags} setItems={setTags} />

    </FormGroup>
   


  );
  */




  return (

    <ItemCrud name="태그" items={tags} setItems={setTags}  tagAdd={tagAdd} tagRemove={tagRemove}   />

  
  );


}

interface ItemCrudProps {
  name: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  tagAdd?: (tag: string) => void;
  tagRemove?: (tag: string) => void;

}


function ItemCrud({ name, items, setItems, tagAdd, tagRemove }: ItemCrudProps): JSX.Element {

  const { register, setValue } = useFormContext();
  const [itemText, setItemText] = useState<string>('');

  function handleItemAdd(): void {
    if (itemText.trim() !== '') {
      const newItem: string = itemText;

      /////setItems([...items, newItem]);
      // if not exist add to tags
      if (!items.includes(newItem)) {
        setItems([...items, newItem]);
      }

      tagAdd && tagAdd(newItem);


      setValue('tags', [...items, newItem]);

      setItemText('');
      
    }
  }

  function handleItemRemove(text: string): void {
    const updatedItems = items.filter((item) => item !== text);
    setItems(updatedItems);

    tagRemove && tagRemove(text);


  }

  return (
    <div>
      <div className="flex items-center">
        <Input
          value={itemText}
          ///placeholder={`Enter a ${name}`}
          placeholder={`태그를 입력하세요.`}
          onChange={(e) => setItemText(e.target.value)}
          prefix={<PiTagBold className="h-4 w-4" />}
          className="w-full"
        />
        <input type="hidden" {...register('tags', { value: items })} />
        <Button
          onClick={handleItemAdd}
          className="ms-4 shrink-0 text-sm @lg:ms-5 dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
        >
          {/*Add {name} */}
          태그 추가
        </Button>
      </div>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((text, index) => (
            
            <div
              key={index}
              className="flex items-center rounded-full border border-gray-300 py-1 pe-2.5 ps-3 text-sm font-medium text-gray-700"
            >
              {text}
              <button
                onClick={() => handleItemRemove(text)}
                className="ps-2 text-gray-500 hover:text-gray-900"
              >
                <PiXBold className="h-3.5 w-3.5" />
              </button>
            </div>

          ))}
        </div>
      )}
    </div>
  );
}
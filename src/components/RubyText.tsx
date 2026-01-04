import { motion } from 'framer-motion';
import { PinyinChar, ContentBlock } from '../types';

interface RubyCharProps {
  char: string;
  pinyin: string;
  isHighlight?: boolean;
  isMissing?: boolean;
  isRevealed?: boolean;
  selectedAnswer?: string;
  isCorrect?: boolean | null;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fireMode?: boolean;
}

export function RubyChar({
  char,
  pinyin,
  isHighlight = false,
  isMissing = false,
  isRevealed = false,
  selectedAnswer,
  isCorrect,
  showFeedback = false,
  size = 'md',
  fireMode = false,
}: RubyCharProps) {
  const sizeClasses = {
    sm: { char: 'text-xl sm:text-2xl', pinyin: 'text-[10px] sm:text-xs' },
    md: { char: 'text-2xl sm:text-3xl', pinyin: 'text-xs sm:text-sm' },
    lg: { char: 'text-3xl sm:text-4xl', pinyin: 'text-sm sm:text-base' },
  };

  if (isMissing) {
    const displayChar = showFeedback ? selectedAnswer : isRevealed ? '___' : '___';

    return (
      <motion.div
        className={`flex flex-col items-center mx-0.5 sm:mx-1 select-none ${
          showFeedback && isCorrect
            ? 'bg-green-500/30 rounded-lg px-2 py-1 border-2 border-green-400'
            : showFeedback && !isCorrect
            ? 'bg-red-500/30 rounded-lg px-2 py-1 border-2 border-red-400'
            : 'bg-[#00b06f]/20 rounded-lg px-2 py-1 border-2 border-dashed border-[#00b06f]'
        }`}
        animate={
          showFeedback && isCorrect
            ? { scale: [1, 1.2, 1], rotateY: [0, 360] }
            : {}
        }
        transition={{ duration: 0.6 }}
      >
        <span className={`${sizeClasses[size].char} font-black ${
          showFeedback && isCorrect ? 'text-green-300' :
          showFeedback && !isCorrect ? 'text-red-300' :
          'text-[#00b06f]'
        }`}>
          {displayChar || '___'}
        </span>
        <span className={`${sizeClasses[size].pinyin} text-gray-500 font-mono mt-0.5`}>
          {showFeedback ? pinyin : '?'}
        </span>
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col items-center mx-0.5 sm:mx-1 select-none ${
      isHighlight ? 'bg-yellow-500/20 rounded-lg px-1' : ''
    }`}>
      <span className={`${sizeClasses[size].char} font-black ${
        isHighlight ? 'text-yellow-300' :
        fireMode ? 'text-orange-200' :
        'text-white'
      }`}>
        {char}
      </span>
      <span className={`${sizeClasses[size].pinyin} ${
        isHighlight ? 'text-yellow-400/80' : 'text-gray-400'
      } font-mono mt-0.5`}>
        {pinyin}
      </span>
    </div>
  );
}

interface RubyTextProps {
  segments: PinyinChar[];
  missingIndices?: number[];
  selectedAnswer?: string;
  isCorrect?: boolean | null;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fireMode?: boolean;
  isListeningMode?: boolean;
  charRevealed?: boolean;
}

export function RubyText({
  segments,
  missingIndices = [],
  selectedAnswer,
  isCorrect,
  showFeedback = false,
  size = 'md',
  fireMode = false,
  isListeningMode = false,
  charRevealed = false,
}: RubyTextProps) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-y-4">
      {segments.map((seg, idx) => {
        const isMissing = missingIndices.includes(idx);
        const isRevealed = !isListeningMode || charRevealed;

        return (
          <RubyChar
            key={idx}
            char={seg.char}
            pinyin={seg.pinyin}
            isHighlight={seg.isHighlight}
            isMissing={isMissing}
            isRevealed={isRevealed}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            showFeedback={showFeedback}
            size={size}
            fireMode={fireMode}
          />
        );
      })}
    </div>
  );
}

interface ContentBlockRendererProps {
  block: ContentBlock;
  missingIndices?: number[];
  selectedAnswer?: string;
  isCorrect?: boolean | null;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fireMode?: boolean;
  isListeningMode?: boolean;
  charRevealed?: boolean;
}

export function ContentBlockRenderer({
  block,
  missingIndices = [],
  selectedAnswer,
  isCorrect,
  showFeedback = false,
  size = 'md',
  fireMode = false,
  isListeningMode = false,
  charRevealed = false,
}: ContentBlockRendererProps) {
  if (block.type === 'dialogue') {
    return (
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base border-2 border-white/30">
            {block.speaker?.charAt(0) || '?'}
          </div>
          <p className="text-center text-xs text-gray-400 mt-1">{block.speaker}</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-2xl rounded-tl-sm p-3 sm:p-4 border border-white/10">
          <RubyText
            segments={block.segments}
            missingIndices={missingIndices}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            showFeedback={showFeedback}
            size={size}
            fireMode={fireMode}
            isListeningMode={isListeningMode}
            charRevealed={charRevealed}
          />
        </div>
      </div>
    );
  }

  if (block.type === 'poem') {
    return (
      <div className="text-center space-y-2 py-4 border-l-4 border-[#00b06f]/50 pl-4 bg-gradient-to-r from-[#00b06f]/5 to-transparent rounded-r-xl">
        <RubyText
          segments={block.segments}
          missingIndices={missingIndices}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          showFeedback={showFeedback}
          size={size}
          fireMode={fireMode}
          isListeningMode={isListeningMode}
          charRevealed={charRevealed}
        />
      </div>
    );
  }

  if (block.type === 'idiom') {
    return (
      <div className="flex justify-center py-4">
        <div className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-xl p-3 sm:p-4 border-2 border-amber-600/30">
          <RubyText
            segments={block.segments}
            missingIndices={missingIndices}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            showFeedback={showFeedback}
            size="lg"
            fireMode={fireMode}
            isListeningMode={isListeningMode}
            charRevealed={charRevealed}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <RubyText
        segments={block.segments}
        missingIndices={missingIndices}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
        showFeedback={showFeedback}
        size={size}
        fireMode={fireMode}
        isListeningMode={isListeningMode}
        charRevealed={charRevealed}
      />
    </div>
  );
}

export default RubyText;
